module Api

open System
open System.Drawing
open System.Runtime.InteropServices


[<DllImport("kernel32.dll",CharSet = CharSet.Auto, SetLastError=true)>]
extern IntPtr GetCurrentProcess()

[<DllImport("shell32.dll", SetLastError = true)>]
extern IntPtr ExtractIconA(IntPtr hInst, string lpszExeFileName, int nIconIndex)

[<DllImport("User32.dll")>]
extern int DestroyIcon(IntPtr hIcon)

let extractIcon path iconId =
    let hIcon = ExtractIconA(GetCurrentProcess(), path, iconId)
    //try
    if hIcon = IntPtr 0 then
        None
    else
        let icon = Icon.FromHandle(hIcon).Clone() :?> Icon
        Some (icon, hIcon)
    //finally
    //    DestroyIcon(hIcon) |> ignore
