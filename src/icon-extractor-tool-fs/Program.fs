open System
open System.IO
open System.Drawing
open Api
open System.Text.RegularExpressions
open ShellLink

type OrElseBuilder() =
    member this.ReturnFrom(x) = x
    member this.Combine (a,b) =
        match a with
        | Some _ -> a
        | None -> b
    member this.Delay(f) = f()

let orElse = OrElseBuilder()

let normalizeString str =
    match String.IsNullOrEmpty str with
    | true -> None
    | false -> Some str

let normalizeOptString = Option.bind normalizeString

let get fx x =
    match fx x with
    | null -> None
    | s -> Some s

let getm fx x =
    Option.bind (get fx) x

let resolveShortcut (target: string) =
    let linkObj = Shortcut.ReadFromFile target;
    let actualPath = orElse {
        return! linkObj
            |> get (fun x -> x.LinkTargetIDList)
            |> getm (fun x -> x.Path)
            |> normalizeOptString

        return! linkObj
            |> get (fun x -> x.ExtraData)
            |> getm (fun x -> x.EnvironmentVariableDataBlock)
            |> getm (fun x -> x.TargetUnicode)
            |> normalizeOptString

        return! linkObj
            |> get (fun x -> x.LinkInfo)
            |> getm (fun x -> x.LocalBasePath)
            |> normalizeOptString

        return! linkObj
            |> get (fun x -> x.StringData)
            |> getm (fun x -> x.IconLocation)
            |> normalizeOptString
    }
    actualPath


let resolveEnvVariablesInPath (target: string) =
    match target.StartsWith("%") with
    | false -> target
    | true ->
        Regex.Replace (target, "%.*%", (fun x -> x.Value.Trim('%') |> Environment.GetEnvironmentVariable))

let getFullPath (target: string) =
    let execIfLink fn (path: string) =
        match path.EndsWith(".lnk", StringComparison.InvariantCultureIgnoreCase) with
        | true -> fn path
        | false -> Some path
    target
    |> resolveEnvVariablesInPath
    |> execIfLink resolveShortcut // Path from .lnk files might contain path with variables as well
    |> Option.map resolveEnvVariablesInPath

let getIcon (target: string) =
    match target.Split(",") |> Array.toList with
    | [] -> None
    | [x] -> Some (Icon.ExtractAssociatedIcon(x), None)
    | path::resourceIdStr::_ ->
        match File.Exists(path) with
        | false -> None
        | true ->
            match Int32.TryParse(resourceIdStr) with
            | (false, _) -> None
            | (true, -1) -> Some (Icon.ExtractAssociatedIcon(path), None)
            | (true, resourceId) ->
                match extractIcon path resourceId with
                | Some (icon, ptr) -> Some (icon, Some ptr)
                | None -> Some (Icon.ExtractAssociatedIcon(path), None)

let getIconAsBase64 target =
    let convertToBase64 (icon: Icon, ptr: Option<IntPtr>) =
        use bitmap = icon.ToBitmap()
        use ms = new IO.MemoryStream()
        bitmap.Save(ms, Imaging.ImageFormat.Png)

        icon.Dispose() |> ignore
        ptr |> Option.map (fun x -> DestroyIcon(x)) |> ignore

        ms.ToArray() |> Convert.ToBase64String

    (getFullPath target)
    |> Option.bind getIcon
    |> Option.map convertToBase64

let getShortcutTarget path =
    File.Exists(path)

[<EntryPoint>]
let main argv =
    Console.InputEncoding = Text.UTF8Encoding.UTF8 |> ignore;
    Console.OutputEncoding = Text.UTF8Encoding.UTF8 |> ignore;

    argv
    |> Array.map (getIconAsBase64
                  >> (function
                      | None -> printfn "--FNF--"
                      | Some icon -> printfn "%s" icon))
    |> ignore
    0 // return an integer exit code
