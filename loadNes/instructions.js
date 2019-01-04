var instructions = {

'61': {'inst': 'adc', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'71': {'inst': 'adc', 'addressing': '(indirect),y', 'assembler': '(oper),y', 'bytes': 2},
'6d': {'inst': 'adc', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'7d': {'inst': 'adc', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'79': {'inst': 'adc', 'addressing': 'absolute,y', 'assembler': 'oper,y', 'bytes': 3},
'69': {'inst': 'adc', 'addressing': 'immidiate', 'assembler': '#oper', 'bytes': 2},
'65': {'inst': 'adc', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'75': {'inst': 'adc', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'21': {'inst': 'and', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'31': {'inst': 'and', 'addressing': '(indirect),y', 'assembler': '(oper),y', 'bytes': 2},
'2d': {'inst': 'and', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'3d': {'inst': 'and', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'39': {'inst': 'and', 'addressing': 'absolute,y', 'assembler': 'oper,y', 'bytes': 3},
'29': {'inst': 'and', 'addressing': 'immidiate', 'assembler': '#oper', 'bytes': 2},
'25': {'inst': 'and', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'35': {'inst': 'and', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'0e': {'inst': 'asl', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'1e': {'inst': 'asl', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'0a': {'inst': 'asl', 'addressing': 'accumulator', 'assembler': 'a', 'bytes': 1},
'06': {'inst': 'asl', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'16': {'inst': 'asl', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'90': {'inst': 'bcc', 'addressing': 'relative', 'assembler': 'oper', 'bytes': 2},
'b0': {'inst': 'bcs', 'addressing': 'relative', 'assembler': 'oper', 'bytes': 2},
'f0': {'inst': 'beq', 'addressing': 'relative', 'assembler': 'oper', 'bytes': 2},
'2c': {'inst': 'bit', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'24': {'inst': 'bit', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'30': {'inst': 'bmi', 'addressing': 'relative', 'assembler': 'oper', 'bytes': 2},
'd0': {'inst': 'bne', 'addressing': 'relative', 'assembler': 'oper', 'bytes': 2},
'10': {'inst': 'bpl', 'addressing': 'relative', 'assembler': 'oper', 'bytes': 2},
'00': {'inst': 'brk', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'50': {'inst': 'bvc', 'addressing': 'relative', 'assembler': 'oper', 'bytes': 2},
'70': {'inst': 'bvc', 'addressing': 'relative', 'assembler': 'oper', 'bytes': 2},
'18': {'inst': 'clc', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'd8': {'inst': 'cld', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'58': {'inst': 'cli', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'b8': {'inst': 'clv', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'c1': {'inst': 'cmp', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'd1': {'inst': 'cmp', 'addressing': '(indirect),y', 'assembler': '(oper),y', 'bytes': 2},
'cd': {'inst': 'cmp', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'dd': {'inst': 'cmp', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'd9': {'inst': 'cmp', 'addressing': 'absolute,y', 'assembler': 'oper,y', 'bytes': 3},
'c9': {'inst': 'cmp', 'addressing': 'immidiate', 'assembler': '#oper', 'bytes': 2},
'c5': {'inst': 'cmp', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'd5': {'inst': 'cmp', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'ec': {'inst': 'cpx', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'e0': {'inst': 'cpx', 'addressing': 'immidiate', 'assembler': '#oper', 'bytes': 2},
'e4': {'inst': 'cpx', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'cc': {'inst': 'cpy', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'c0': {'inst': 'cpy', 'addressing': 'immidiate', 'assembler': '#oper', 'bytes': 2},
'c4': {'inst': 'cpy', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'ce': {'inst': 'dec', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'de': {'inst': 'dec', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'88': {'inst': 'dec', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'ca': {'inst': 'dec', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'c6': {'inst': 'dec', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'd6': {'inst': 'dec', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'41': {'inst': 'eor', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'51': {'inst': 'eor', 'addressing': '(indirect),y', 'assembler': '(oper),y', 'bytes': 2},
'4d': {'inst': 'eor', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'5d': {'inst': 'eor', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'59': {'inst': 'eor', 'addressing': 'absolute,y', 'assembler': 'oper,y', 'bytes': 3},
'49': {'inst': 'eor', 'addressing': 'immidiate', 'assembler': '#oper', 'bytes': 2},
'45': {'inst': 'eor', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'55': {'inst': 'eor', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'ee': {'inst': 'inc', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'fe': {'inst': 'inc', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'e6': {'inst': 'inc', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'f6': {'inst': 'inc', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'e8': {'inst': 'inx', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'c8': {'inst': 'iny', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'4c': {'inst': 'jmp', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'6c': {'inst': 'jmp', 'addressing': 'indirect', 'assembler': '(oper)', 'bytes': 3},
'20': {'inst': 'jsr', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'a1': {'inst': 'lda', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'b1': {'inst': 'lda', 'addressing': '(indirect),y', 'assembler': '(oper),y', 'bytes': 2},
'ad': {'inst': 'lda', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'bd': {'inst': 'lda', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'b9': {'inst': 'lda', 'addressing': 'absolute,y', 'assembler': 'oper,y', 'bytes': 3},
'a9': {'inst': 'lda', 'addressing': 'immidiate', 'assembler': '#oper', 'bytes': 2},
'a5': {'inst': 'lda', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'b5': {'inst': 'lda', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'ae': {'inst': 'ldx', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'be': {'inst': 'ldx', 'addressing': 'absolute,y', 'assembler': 'oper,y', 'bytes': 3},
'a2': {'inst': 'ldx', 'addressing': 'immidiate', 'assembler': '#oper', 'bytes': 2},
'a6': {'inst': 'ldx', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'b6': {'inst': 'ldx', 'addressing': 'zeropage,y', 'assembler': 'oper,y', 'bytes': 2},
'ac': {'inst': 'ldy', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'bc': {'inst': 'ldy', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'a0': {'inst': 'ldy', 'addressing': 'immidiate', 'assembler': '#oper', 'bytes': 2},
'a4': {'inst': 'ldy', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'b4': {'inst': 'ldy', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'4e': {'inst': 'lsr', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'5e': {'inst': 'lsr', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'4a': {'inst': 'lsr', 'addressing': 'accumulator', 'assembler': 'a', 'bytes': 1},
'46': {'inst': 'lsr', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'56': {'inst': 'lsr', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'ea': {'inst': 'nop', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'01': {'inst': 'ora', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'11': {'inst': 'ora', 'addressing': '(indirect),y', 'assembler': '(oper),y', 'bytes': 2},
'0d': {'inst': 'ora', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'1d': {'inst': 'ora', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'19': {'inst': 'ora', 'addressing': 'absolute,y', 'assembler': 'oper,y', 'bytes': 3},
'09': {'inst': 'ora', 'addressing': 'immidiate', 'assembler': '#oper', 'bytes': 2},
'05': {'inst': 'ora', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'15': {'inst': 'ora', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'48': {'inst': 'pha', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'08': {'inst': 'php', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'68': {'inst': 'pla', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'28': {'inst': 'plp', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'2e': {'inst': 'rol', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'3e': {'inst': 'rol', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'2a': {'inst': 'rol', 'addressing': 'accumulator', 'assembler': 'a', 'bytes': 1},
'26': {'inst': 'rol', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'36': {'inst': 'rol', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'6e': {'inst': 'ror', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'7e': {'inst': 'ror', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'6a': {'inst': 'ror', 'addressing': 'accumulator', 'assembler': 'a', 'bytes': 1},
'66': {'inst': 'ror', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'76': {'inst': 'ror', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'40': {'inst': 'rti', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'60': {'inst': 'rts', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'e1': {'inst': 'sbc', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'f1': {'inst': 'sbc', 'addressing': '(indirect),y', 'assembler': '(oper),y', 'bytes': 2},
'ed': {'inst': 'sbc', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'fd': {'inst': 'sbc', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'f9': {'inst': 'sbc', 'addressing': 'absolute,y', 'assembler': 'oper,y', 'bytes': 3},
'e9': {'inst': 'sbc', 'addressing': 'immidiate', 'assembler': '#oper', 'bytes': 2},
'e5': {'inst': 'sbc', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'f5': {'inst': 'sbc', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'38': {'inst': 'sec', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'f8': {'inst': 'sed', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'78': {'inst': 'sei', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'81': {'inst': 'sta', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'91': {'inst': 'sta', 'addressing': '(indirect),y', 'assembler': '(oper),y', 'bytes': 2},
'8d': {'inst': 'sta', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'9d': {'inst': 'sta', 'addressing': 'absolute,x', 'assembler': 'oper,x', 'bytes': 3},
'99': {'inst': 'sta', 'addressing': 'absolute,y', 'assembler': 'oper,y', 'bytes': 3},
'85': {'inst': 'sta', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'95': {'inst': 'sta', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'8e': {'inst': 'stx', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'86': {'inst': 'stx', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'96': {'inst': 'stx', 'addressing': 'zeropage,y', 'assembler': 'oper,y', 'bytes': 2},
'8c': {'inst': 'sty', 'addressing': 'absolute', 'assembler': 'oper', 'bytes': 3},
'84': {'inst': 'sty', 'addressing': 'zeropage', 'assembler': 'oper', 'bytes': 2},
'94': {'inst': 'sty', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'aa': {'inst': 'tax', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'a8': {'inst': 'tay', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'ba': {'inst': 'tsx', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'8a': {'inst': 'txa', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'9a': {'inst': 'txs', 'addressing': 'implied', 'assembler': '', 'bytes': 1},
'98': {'inst': 'tya', 'addressing': 'implied', 'assembler': '', 'bytes': 1}
}