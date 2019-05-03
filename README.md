Access to production for live demo here:

https://remisharrock.github.io/sysbuild/

Thanks to "Lawrence Angrave, University of Illinois and UIUC students" for their [initial project](https://github.com/cs-education/sysbuild/)

**Development environment prerequisites on Windows 10**

- Windows 10
- Webstorm 2017.2
- Chocolatey package manager 0.10.8 (choco) to install Git and Nodejs on windows
- Git version 2.14.2.windows.1 (installed with `choco install git`)
- NodeJS 9.0.0 (installed with `choco install nodejs`) with npm version 5.5.1
- python 2 2.7.14 (installed with `choco install python2`)
- dotNET core sdk 2 (installed with `choco install dotnetcore-sdk`)
- VCBuild.exe and windows build tools (installed with `npm install --global --production windows-build-tools` ; which installs python 2.7.13)

**Installation**

- Install globally **gulp** and **bower** with `npm install -g bower gulp`
- Verify installation:  
```
bower --version
1.8.2
```
```
gulp --version
[13:05:52] Failed to load external module babel-register
[13:05:52] Requiring external module babel-core/register
[13:05:52] CLI version 3.9.1
[13:05:52] Local version 3.9.1
```

- `cd webapp`
- `npm install`
- start the dev server gulp. **Do not forget to authorize the firewall on windows is asked.**
```
gulp serve
[13:22:19] Failed to load external module babel-register
[13:22:19] Requiring external module babel-core/register
[13:22:22] Using gulpfile ~\WebstormProjects\sysbuild\webapp\gulpfile.babel.js
(node:2612) ExperimentalWarning: The http2 module is an experimental API.
[13:22:22] Starting 'css:src'...
[13:22:22] Finished 'css:src' after 683 ms
[13:22:22] Starting 'css:watch'...
[13:22:22] Finished 'css:watch' after 39 ms
[13:22:22] Starting 'serve:src'...
[13:22:23] Finished 'serve:src' after 39 ms
[13:22:23] Starting 'serve'...
[13:22:23] Finished 'serve' after 51 μs
[13:22:23] Server started http://localhost:8080
```
- Go to `http://localhost:8080` in your favorite browser

 
