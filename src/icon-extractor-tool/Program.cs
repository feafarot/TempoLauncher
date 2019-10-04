using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using ShellLink;
using System.Runtime.InteropServices;
using System.Collections.Generic;

namespace IconExtarctor
{
    static class WinApi
    {
        [DllImport("Kernel32.dll", SetLastError = true)]
        public static extern IntPtr GetCurrentProcess();

        [DllImport("shell32.dll", SetLastError = true)]
        public static extern IntPtr ExtractIconA(IntPtr hInst, string lpszExeFileName, int nIconIndex);

        // [DllImport("shell32.dll", SetLastError = true)]
        // public static extern short ExtractIconExA(IntPtr hInst, string lpszExeFile, int nIconIndex);

        [DllImport("User32.dll")]
        public static extern int DestroyIcon(IntPtr hIcon);
    }

    class Program
    {
        const string fileNotFound = "--FNF--";

        static List<IntPtr> _iconsToDestroy = new List<IntPtr>();

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

            _iconsToDestroy.ForEach(x => WinApi.DestroyIcon(x));
            // Console.WriteLine("\nTotal tile: {0}", stopWatch.Elapsed);
        }

        static string GetBase64Icon(string path)
        {
            var target = path;
            if (path.EndsWith(".lnk"))
            {
                target = GetShortcutTarget(path);
            }
            Path.GetFullPath(path);
            if (target == null)
            {
                return fileNotFound;
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
            try
            {
                using (var icon = GetIcon(Path.GetFullPath(target)))
                using (var bmp = icon.ToBitmap())
                using (var ms = new MemoryStream())
                {
                    bmp.Save(ms, ImageFormat.Png);
                    base64Icon = Convert.ToBase64String(ms.ToArray());
                }
            }
            catch (FileNotFoundException)
            {
                base64Icon = fileNotFound;
            }

            return base64Icon;
        }

        static Icon GetIcon(string target)
        {
            if (target.Contains(","))
            {
                var parts = target.Split(",");
                try
                {
                    return GetIconFromResource(parts[0], int.Parse(parts[1]));
                }
                catch
                {
                    return Icon.ExtractAssociatedIcon(parts[0]);
                }
            }

            return Icon.ExtractAssociatedIcon(target);
        }

        static Icon GetIconFromResource(string target, int id)
        {
            if (id == - 1)
            {
                throw new Exception("Cannot extract icon with resource id -1. Fallback to ExtractAssociatedIcon method.");
            }

            var hIcon = WinApi.ExtractIconA(WinApi.GetCurrentProcess(), target, id);
            try
            {
                var icon = (Icon)Icon.FromHandle(hIcon).Clone();
                return icon;
            }
            finally
            {
                _iconsToDestroy.Add(hIcon);
            }
        }

        static string GetShortcutTarget(string path)
        {
            if (!System.IO.File.Exists(path))
            {
                return null;
            }

            var linkObj = Shortcut.ReadFromFile(path);
            var target = NormalizeNull(linkObj?.LinkTargetIDList?.Path)
                ?? NormalizeNull(linkObj?.ExtraData?.EnvironmentVariableDataBlock?.TargetUnicode)
                ?? NormalizeNull(linkObj?.LinkInfo?.LocalBasePath)
                ?? NormalizeNull(linkObj?.StringData?.IconLocation);
            if (string.IsNullOrEmpty(target)
                && (linkObj?.StringData?.NameString ?? string.Empty).Contains("%windir%\\explorer.exe", StringComparison.InvariantCultureIgnoreCase))
            {
                target = "%windir%\\explorer.exe";
            }

            if (Path.GetExtension(target) == ".msc")
            {
                return path;
            }

            return target;
        }

        static string NormalizeNull(string value)
        {
            return string.IsNullOrEmpty(value) ? null : value;
        }
    }
}
