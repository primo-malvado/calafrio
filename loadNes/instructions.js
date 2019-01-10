var instructions = {

'78': function(cpu){cpu.implied(); cpu.sei();},
'ea': function(cpu){cpu.implied(); cpu.nop();},
'48': function(cpu){cpu.implied(); cpu.pha();},
'08': function(cpu){cpu.implied(); cpu.php();},
'68': function(cpu){cpu.implied(); cpu.pla();},
'28': function(cpu){cpu.implied(); cpu.plp();},
'40': function(cpu){cpu.implied(); cpu.rti();},
'60': function(cpu){cpu.implied(); cpu.rts();},
'38': function(cpu){cpu.implied(); cpu.sec();},
'f8': function(cpu){cpu.implied(); cpu.sed();},
'aa': function(cpu){cpu.implied(); cpu.tax();},
'a8': function(cpu){cpu.implied(); cpu.tay();},
'ba': function(cpu){cpu.implied(); cpu.tsx();},
'8a': function(cpu){cpu.implied(); cpu.txa();},
'9a': function(cpu){cpu.implied(); cpu.txs();},
'98': function(cpu){cpu.implied(); cpu.tya();},
'00': function(cpu){cpu.implied(); cpu.brk();},
'18': function(cpu){cpu.implied(); cpu.clc();},
'd8': function(cpu){cpu.implied(); cpu.cld();},
'58': function(cpu){cpu.implied(); cpu.cli();},
'b8': function(cpu){cpu.implied(); cpu.clv();},
'88': function(cpu){cpu.implied(); cpu.dey();},
'ca': function(cpu){cpu.implied(); cpu.dex();},
'e8': function(cpu){cpu.implied(); cpu.inx();},
'c8': function(cpu){cpu.implied(); cpu.iny();},


'5d': function(cpu){cpu.absoluteX(); cpu.eor();},
'fe': function(cpu){cpu.absoluteX(); cpu.inc();},
'bd': function(cpu){cpu.absoluteX(); cpu.lda();},
'bc': function(cpu){cpu.absoluteX(); cpu.ldy();},
'5e': function(cpu){cpu.absoluteX(); cpu.lsr();},
'1d': function(cpu){cpu.absoluteX(); cpu.ora();},
'3e': function(cpu){cpu.absoluteX(); cpu.rol();},
'7e': function(cpu){cpu.absoluteX(); cpu.ror();},
'fd': function(cpu){cpu.absoluteX(); cpu.sbc();},
'9d': function(cpu){cpu.absoluteX(); cpu.sta();},
'1e': function(cpu){cpu.absoluteX(); cpu.asl();},
'3d': function(cpu){cpu.absoluteX(); cpu.and();},
'7d': function(cpu){cpu.absoluteX(); cpu.adc();},
'dd': function(cpu){cpu.absoluteX(); cpu.cmp();},
'de': function(cpu){cpu.absoluteX(); cpu.dec();},



'61': {'inst': 'adc', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'71': function(cpu){cpu._indirect_Y(); cpu.adc();},
'6d': function(cpu){cpu.absolute(); cpu.adc();},

'79': function(cpu){cpu.absoluteY(); cpu.adc();},
'69': function(cpu){cpu.immidiate(); cpu.adc();},
'65': function(cpu){cpu.zeropage(); cpu.adc();},
'75': {'inst': 'adc', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'21': {'inst': 'and', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'31': function(cpu){cpu._indirect_Y(); cpu.and();},
'2d': function(cpu){cpu.absolute(); cpu.and();},
'39': function(cpu){cpu.absoluteY(); cpu.and();},
'29': function(cpu){cpu.immidiate(); cpu.and();},
'25': function(cpu){cpu.zeropage(); cpu.and();},
'35': {'inst': 'and', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'0e': function(cpu){cpu.absolute(); cpu.asl();},

'0a': function(cpu){cpu.accumulator(); cpu.asl_a();},
'06': function(cpu){cpu.zeropage(); cpu.asl();},
'16': {'inst': 'asl', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'90': function(cpu){cpu.relative(); cpu.bcc();},
'b0': function(cpu){cpu.relative(); cpu.bcs();},
'f0': function(cpu){cpu.relative(); cpu.beq();},
'2c': function(cpu){cpu.absolute(); cpu.bit();},
'24': function(cpu){cpu.zeropage(); cpu.bit();},
'30': function(cpu){cpu.relative(); cpu.bmi();},
'd0': function(cpu){cpu.relative(); cpu.bne();},
'10': function(cpu){cpu.relative(); cpu.bpl();},
'50': function(cpu){cpu.relative(); cpu.bvc();},
'70': function(cpu){cpu.relative(); cpu.bvs();},



'c1': {'inst': 'cmp', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'd1': function(cpu){cpu._indirect_Y(); cpu.cmp();},
'cd': function(cpu){cpu.absolute(); cpu.cmp();},

'd9': function(cpu){cpu.absoluteY(); cpu.cmp();},
'c9': function(cpu){cpu.immidiate(); cpu.cmp();},
'c5': function(cpu){cpu.zeropage(); cpu.cmp();},
'd5': {'inst': 'cmp', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'ec': function(cpu){cpu.absolute(); cpu.cpx();},
'e0': function(cpu){cpu.immidiate(); cpu.cpx();},
'e4': function(cpu){cpu.zeropage(); cpu.cpx();},
'cc': function(cpu){cpu.absolute(); cpu.cpy();},
'c0': function(cpu){cpu.immidiate(); cpu.cpy();},
'c4': function(cpu){cpu.zeropage(); cpu.cpy();},
'ce': function(cpu){cpu.absolute(); cpu.dec();},
'c6': function(cpu){cpu.zeropage(); cpu.dec();},
'd6': {'inst': 'dec', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'41': {'inst': 'eor', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'51': function(cpu){cpu._indirect_Y(); cpu.eor();},
'4d': function(cpu){cpu.absolute(); cpu.eor();},
'59': function(cpu){cpu.absoluteY(); cpu.eor();},

'49': function(cpu){cpu.immidiate(); cpu.eor();},
'45': function(cpu){cpu.zeropage(); cpu.eor();},
'55': {'inst': 'eor', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'ee': function(cpu){cpu.absolute(); cpu.inc();},
'e6': function(cpu){cpu.zeropage(); cpu.inc();},
'f6': {'inst': 'inc', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'4c': function(cpu){cpu.absolute(); cpu.jmp();},
//'6c': {'inst': 'jmp', 'addressing': 'indirect', 'assembler': '(oper)', 'bytes': 3},
'6c': function(cpu){cpu.indirect(); cpu.jmp();},
'20': function(cpu){cpu.absolute(); cpu.jsr();},
'a1': {'inst': 'lda', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'b1': function(cpu){cpu._indirect_Y(); cpu.lda();},
'ad': function(cpu){cpu.absolute(); cpu.lda();},
'b9': function(cpu){cpu.absoluteY(); cpu.lda();},


'a9': function(cpu){cpu.immidiate(); cpu.lda();},
'a5': function(cpu){cpu.zeropage(); cpu.lda();},
'b5': {'inst': 'lda', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'ae': function(cpu){cpu.absolute(); cpu.ldx();},
'be': function(cpu){cpu.absoluteY(); cpu.ldx();},
'a2': function(cpu){cpu.immidiate(); cpu.ldx();},
'a6': function(cpu){cpu.zeropage(); cpu.ldx();},
'b6': {'inst': 'ldx', 'addressing': 'zeropage,y', 'assembler': 'oper,y', 'bytes': 2},
'ac': function(cpu){cpu.absolute(); cpu.ldy();},
'a0': function(cpu){cpu.immidiate(); cpu.ldy();},
'a4': function(cpu){cpu.zeropage(); cpu.ldy();},
'b4': {'inst': 'ldy', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'4e': function(cpu){cpu.absolute(); cpu.lsr();},
'4a': function(cpu){cpu.accumulator(); cpu.lsr_a();},
'46': function(cpu){cpu.zeropage(); cpu.lsr();},
'56': {'inst': 'lsr', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'01': {'inst': 'ora', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'11': function(cpu){cpu._indirect_Y(); cpu.ora();},
'0d': function(cpu){cpu.absolute(); cpu.ora();},
'19': function(cpu){cpu.absoluteY(); cpu.ora();},
'09': function(cpu){cpu.immidiate(); cpu.ora();},
'05': function(cpu){cpu.zeropage(); cpu.ora();},
'15': {'inst': 'ora', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'2e': function(cpu){cpu.absolute(); cpu.rol();},
'2a': function(cpu){cpu.accumulator(); cpu.rol_a();},
'26': function(cpu){cpu.zeropage(); cpu.rol();},
'36': {'inst': 'rol', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'6e': function(cpu){cpu.absolute(); cpu.ror();},
'6a': function(cpu){cpu.accumulator(); cpu.ror_a();},
'66': function(cpu){cpu.zeropage(); cpu.ror();},
'76': {'inst': 'ror', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'e1': {'inst': 'sbc', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'f1': function(cpu){cpu._indirect_Y(); cpu.sbc();},
'ed': function(cpu){cpu.absolute(); cpu.sbc();},
'f9': function(cpu){cpu.absoluteY(); cpu.sbc();},
'e9': function(cpu){cpu.immidiate(); cpu.sbc();},
'e5': function(cpu){cpu.zeropage(); cpu.sbc();},
'f5': {'inst': 'sbc', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},

'81': {'inst': 'sta', 'addressing': '(indirect,x)', 'assembler': '(oper,x)', 'bytes': 2},
'91': function(cpu){cpu._indirect_Y(); cpu.sta();},
'8d': function(cpu){cpu.absolute(); cpu.sta();},
'99': function(cpu){cpu.absoluteY(); cpu.sta();},
'85': function(cpu){cpu.zeropage(); cpu.sta();},
'95': {'inst': 'sta', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},
'8e': function(cpu){cpu.absolute(); cpu.stx();},
'86': function(cpu){cpu.zeropage(); cpu.stx();},
'96': {'inst': 'stx', 'addressing': 'zeropage,y', 'assembler': 'oper,y', 'bytes': 2},
'8c': function(cpu){cpu.absolute(); cpu.sty();},
'84': function(cpu){cpu.zeropage(); cpu.sty();},
'94': {'inst': 'sty', 'addressing': 'zeropage,x', 'assembler': 'oper,x', 'bytes': 2},

}