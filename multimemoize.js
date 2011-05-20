/**
 * Provides a memory-efficient cache for local variables in a function
 * ('multi-memoized'), as that function is executed 'n' times.
 * Does not necessarily cache the return value: Can cache any values.
 * @param p_fnMemoizable {function} The function to be multi-memoized.
 * @param p_aCacheableNames {Array<string>} Names of local variables to be cached.
 * @return function The multi-memoized function.
 */
function com_treelogic_swe_util_multimemoize( p_fnMemoizable, p_aCacheableNames ) {
    var // Create the 'var' block for our memoizer:
        sVars = "var " + p_aCacheableNames.join() + ";",
        /*-
         * Create an outer function definition to hold our local memos.
         * Note that we're using 'Function', the function constructor here,
         * since it does not create a closure to hold its own outer scope.
         * That enables this code to be more memory efficient, and also faster.
         * 
         * Separately, we also use 'toString' here because 'valueOf' will 
         * require an extra type conversion, from function primitive to string.
         */ 
        fnMemorizer = new Function( "", sVars + " return " + p_fnMemoizable.toString() + ";" );

    // To see how this works, uncomment the following statement:
    // console.log( fnMemoizer );         

    return fnMemorizer();
}


/**
 * The expected output of this test is this:
 * 0
 * 1
 * 2
 */
(function memoTest() {

     function run() {
         /*-
          * This conditional checks to see that we're doing local caching and 
          * not mistakenly using inadvertent globals:
          */ 
         if( typeof self.iSeed !== "undefined" ) {

             throw new Error( "bonk :( We failed to cached 'iSeed' locally with a memo." );
         }

         if( typeof iSeed === "undefined" ) {
             iSeed = 0;
         }

         return iSeed++;
     }

     // Execute the test: Start -------
     var run = com_treelogic_swe_util_multimemoize( run, [ "iSeed" ] );
     console.log( run() );
     console.log( run() );
     console.log( run() );
     // Execute the test: End  --------

 })();

