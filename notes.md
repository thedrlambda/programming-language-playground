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
