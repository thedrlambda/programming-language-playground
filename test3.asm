push 6
call odd
push 11111
jmp end

.odd 1 0
:odd_loop
load 0
push 1
sub
dup
store 0
zero odd_odd odd_unknown
:odd_unknown
load 0
push 1
sub
dup
store 0
zero odd_even odd_loop
:odd_even
push 1
return
:odd_odd
push 0
return

:end

