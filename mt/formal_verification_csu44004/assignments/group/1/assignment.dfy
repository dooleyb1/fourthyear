/* 
 * This method should return true iff pre is a valid prefix
 * of the string str. That is, str starts with pre.
 * 
 */
method isPrefix(pre: string, str: string) returns (res:bool)
    requires |pre| > 0
    requires |str| > 0
    requires |pre| <= |str|
{
    // If all of pre is = str[0-|pre|]
    if pre == str[..|pre|]
        { return true; }
    else
        { return false; }
}

/* 
 * This method should return true iff sub is a valid substring
 * of the string str. That is, str contains the string with sub.
 * 
 */
method isSubstring(sub: string, str: string) returns (res:bool)
    requires |sub| <= |str|
    requires 0 < |sub|
    requires 0 < |str|
{
    // First check if sub is a prefix of str
    var isPrefix := isPrefix(sub, str);
    if isPrefix
        { return true; }
    

    // Loop over string looking for sub. Assume false try prove true.
    var i := 0;
    var j := |str|-|sub|;
    
    var temp : bool;

    while i < |str|
        invariant i >= 0
        decreases j - i
    {
        // Check if it is a prefix from str[i]
        temp := isPrefix(sub, str[i..]);
        
        if temp
            { return true; }
        else
            { i := i+1; }
    }

    // If we exit the while without finding true, return false
    return false;
}

/* 
 * This method should return true iff str1 and str2 have a common substring of length k
 * 
 */
method haveCommonKSubstring(k: nat, str1: string, str2: string) returns (found: bool)
    requires |str1| > 0
    requires |str2| > 0
    requires k > 0
    requires k <= |str1|
    requires k <= |str2|
{
   // Loop over str1 taking chunks of k from i and comparing them with str2
   var i := 0;
   var endIndex := |str1| - k;
   var temp : bool;

    while i < endIndex
        invariant i >= 0
        decreases endIndex - i
    {
        // Check if str1 from i->i+k is a substring of str2
        temp := isSubstring(str1[i..i+k], str2);
        
        if temp
            { return true; }
        else
            { i := i+1; }
    }

    // If we exit the while without finding true, return false
    return false;
}

/* 
 * This method should return the natural number length len which is equal to
 * the length of the longest common substring of str1 and str2. Note that
 * every two strings have a common substring of length zero.
 * 
 */
method maxCommonSubstringLength(str1: string, str2: string) returns (len:nat)
    requires |str1| > 0
    requires |str2| > 0
{
    // All strings have a common substring of length 0 (empty string)
    var commonSubstrLength := 0;
    var hasCommonSubstring := false;

    // Check for the highest length substring starting at 1
    var i := 1;
    while(i <= |str1| && i <= |str2|)
    {
        // Check if strings have a common substring of length i
        hasCommonSubstring := haveCommonKSubstring(i, str1, str2);
        
        // If there is no substring, return commonSubstrLength
        if hasCommonSubstring == false
            { return commonSubstrLength; }
        else 
            { i := i +1; }
    }

    // Return common substring length if we exit the loop
    return commonSubstrLength;
}