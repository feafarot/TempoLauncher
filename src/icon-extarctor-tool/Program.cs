using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using ShellLink;

namespace IconExtarctor
{
    class Program
    {
        static void Main(string[] args)
        {
            // var stopWatch = new Stopwatch();
            // stopWatch.Start();
            Console.InputEncoding = UTF8Encoding.UTF8;
            Console.OutputEncoding = UTF8Encoding.UTF8;
            if (args.Length == 0)
            {
                return;
            }

            foreach (var path in args)
            {
                var icon = GetBase64Icon(path);
                Console.WriteLine(icon);
            }

            // Console.WriteLine("\nTotal tile: {0}", stopWatch.Elapsed);
        }

        static string GetBase64Icon(string path)
        {
            var target = path;
            if (path.EndsWith(".lnk"))
            {
                target = GetShortcutTarget(path);
            }

            if (target.StartsWith("%"))
            {
                target = Regex.Replace(target, "%.+%", (x) =>
                {
                    var envVarName = x.Value.Trim('%');
                    return Environment.GetEnvironmentVariable(envVarName);
                });
            }

            string base64Icon;
            //Path.GetFullPath(path);
            try
            {
                using (var icon = Icon.ExtractAssociatedIcon(Path.GetFullPath(target)))
                using (var bmp = icon.ToBitmap())
                using (var ms = new MemoryStream())
                {
                    bmp.Save(ms, ImageFormat.Png);
                    base64Icon = Convert.ToBase64String(ms.ToArray());
                }
            }
            catch (FileNotFoundException)
            {
                base64Icon = "--FNF--" ;
            }

            return base64Icon;
        }

        static string GetShortcutTarget(string path)
        {
            if (!System.IO.File.Exists(path))
            {
                return null;
            }

            var linkObj = Shortcut.ReadFromFile(path);
            var target = linkObj?.LinkTargetIDList?.Path
                ?? linkObj?.ExtraData?.EnvironmentVariableDataBlock?.TargetUnicode
                ?? linkObj?.LinkInfo?.LocalBasePath;
            if (Path.GetExtension(target) == ".msc")
            {
                return path;
            }

            return target;
        }
    }
}
