/* 
 * This function takes a sequence of integers as a 
 * parameter and ensures that all i,j - indicies of
 * s - that s[i] is less than s[j]
 * 
 */
predicate sorted(s: seq<int>)
{
   forall i,j :: 0 <= i < j < |s| ==> s[i] <= s[j]
}

/* 
 * This function works similar to the one above however
 * it recursively calls itself to ensure the sequence 
 * is sorted.
 * 
 */
predicate sortedRecursive(s: seq<int>)
{
   0 < |s| ==> (forall i :: 0 < i < |s| ==> s[0] <= s[i]) &&
               sortedRecursive(s[1..])
}