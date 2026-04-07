Set Shell = CreateObject("WScript.Shell")
Set Shortcut = Shell.CreateShortcut(Shell.SpecialFolders("Startup") & "\VortexLink.lnk")
Shortcut.TargetPath = "C:\Users\thora\.gemini\antigravity\scratch\IP-Codemaker-Agent\LAUNCH_VORTEX.bat"
Shortcut.WorkingDirectory = "C:\Users\thora\.gemini\antigravity\scratch\IP-Codemaker-Agent"
Shortcut.Save
