jmp start
.add 2 0
load 0
push 0
load 1
sub 
sub
return

.fib 1 2
push 0
store 1
push 1
store 2
:loop
load 0
zero done inside
:inside
load 2
load 2
load 1
call add
store 2
store 1
load 0
push 1
sub
store 0
jmp loop
:done
load 1
return

:start
push 10
call fib
push 11111
:end