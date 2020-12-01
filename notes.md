# Subtract (then) Branch if Not Zero (SBNZ)

```
SBNZ [a], [b], [c], d
```
Is interpreted as:
```
c = [b] - [a]
if ( [c] != 0 ) jmp d
```

---

```
SBNZ [5] [10] 10 4
SBNZ [0] [1] [1] -1
```
Is written as
```
11 12 10 4 8 9 9 -1 0 1 9999 5 10
```
Should output
```
11 12 10 4 8 9 9 -1 0 1 5 5 10
```

## Compiling

```
[0] [1] [1] d
```
Is the same as
```
jmp d
```

----

```
[0] a b d
```
Is the same as
```
b = a
```

## Toyc

```
for ( decl_like ; cond ; inc_like )
  body
```

```
block
  decl_like
  while (cond)
    block
      body
      inc_like
```

=== Regexp


Plan:
1. Make a NFA from regex
2. NFA => FA
3. Combines multiple regex (produce token)
4. Minimizer algorithm
X. Table driven matcher

Updated plan:
* Tokens for acceptance states
* Minimizer
* Parse input configuration
* Store table as file
* Desugaring





Scanner:
  | '(' OPEN_PAREN
  | ')' CLOSE_PAREN




AB     A then B
A|B    A or B
A*     Zero or more A's

0011    0011
00|11   00, 11
01*     0, 01, 011, 0111...

(0|1)*1   1, 01, 11, 001, 011, 101, 111, ...


Syntactic sugar:
[A-Z] ==> (A|B|C|...|Z)
A+ ==> AA*
. ==> (A|B|C|...)
A{4} ==> AAAA
