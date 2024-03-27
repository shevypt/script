// Frida script to match and replace "abcd" with "xyz" in a Windows process

// Target process name
const targetProcessName = "YourProcess.exe";

// String to match and replace
const searchString = "abcd";
const replaceString = "xyz";

// Function to intercept and modify strings
Interceptor.attach(Module.findExportByName(null, 'GetProcAddress'), {
    onEnter: function (args) {
        // Obtain the pointer to the function being resolved
        const address = args[1];
        // Resolve the function name
        const functionName = Memory.readUtf8String(Memory.readPointer(address));

        // Check if the resolved function name matches our target process
        if (functionName.indexOf(targetProcessName) !== -1) {
            // Function name matches, let's hook it
            console.log("[*] Hooking: " + functionName);

            // Now let's hook the function
            Interceptor.attach(address, {
                onEnter: function (args) {
                    // Get the string argument
                    let str = Memory.readUtf16String(args[0]);
                    // Check if the string contains the search string
                    if (str.indexOf(searchString) !== -1) {
                        // Replace the string
                        str = str.replace(new RegExp(searchString, 'g'), replaceString);
                        // Write the modified string back
                        Memory.writeUtf16String(args[0], str);
                        console.log("[*] Replaced string: " + str);
                    }
                }
            });
        }
    }
});

console.log("[*] Frida script loaded...");
