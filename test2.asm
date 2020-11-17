push 9 
:loop
dup
push 1
sub
zero done body
:body
dup
call odd
zero odd even
:odd
push 3
call mult
push -1
sub
jmp loop
:even
push 2
call div
jmp loop
:done
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

.le 1 1
load 0
dup
store 1
zero le_true le_loop
:le_loop
load 0
push 1
sub
dup
store 0
zero le_false le_unknown
:le_unknown
load 1
push -1
sub
dup
store 1
zero le_true le_loop
:le_false
push 1
return
:le_true
push 0
return

.mult 2 1
push 0
store 2
:mult_loop
load 0
zero mult_done mult_continue
:mult_continue
load 2
push 0
load 1
sub
sub
store 2
load 0
push 1
sub
store 0
jmp mult_loop
:mult_done
load 2
return

.div 2 1
push 0
store 2
:div_loop
load 1
load 0
sub
call le
zero div_le div_gt
:div_le
load 0
load 1
sub
store 0
load 2
push -1
sub
store 2
jmp div_loop
:div_gt
load 2
return



:end