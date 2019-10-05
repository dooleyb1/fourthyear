/* 
 * This demonstrates returning values from a method
 * 
 * requires y > 0 - Postcondition will fail if this is not set
 * ensures less < x && x < more - Postcondition validating parameters
 * 
 */
method MultipleReturns(x: int, y: int) returns (more: int, less: int)
    requires y > 0
    ensures less < x && x < more
{
   more := x + y;
   less := x - y;
}

/* 
 * This method returns the absolute value of an integer
 * 
 * ensures 0 <= y - Result will always be >= 0
 * 
 */
method Abs(x: int) returns (y: int)
    ensures 0 <= y
    ensures 0 <= x ==> x == y
    ensures x < 0 ==> y == -x
{
   if x < 0
      { return -x; }
   else
      { return x; }
}

/* 
 * This method returns the max of two integers
 */
method Max(x: int, y: int) returns (max: int)
    ensures x >= y ==> max == x
    ensures x < y ==> max == y
{
   if x >= y
      { return x; }
   else
      { return y; }
}

/* 
 * Assert statements can be placed mid-method and
 * can be used with variables to test Dafny
 */
method Testing()
{
    var v := Abs(3);
    assert v == 3;
}

/* 
 * Testing the Max method with assert statements
 */
method TestingMax()
{
    var x := 1;
    var y := 2;
    var max := Max(x, y);

    assert max == 2;
}
