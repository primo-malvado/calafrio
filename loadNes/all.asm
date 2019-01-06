---------
       __8000: sei 
       __8001: cld 
       __8002: lda #$10
       __8004: sta $2000
       __8007: ldx #$ff
       __8009: txs 
       __800a: lda $2002
       __800d: bpl __800a; 800a
       __800f: lda $2002
       __8012: bpl __800f; 800f
       __8014: ldy #$fe
       __8016: ldx #$5
       __8018: lda $7d7,x
       __801b: cmp #$a
       __801d: bcs __802b; 802b
       __801f: dex 
       __8020: bpl __8018; 8018
       __8022: lda $7ff
       __8025: cmp #$a5
       __8027: bne __802b; 802b
       __8029: ldy #$d6
       __802b: jsr __90cc; 90cc
       __802e: sta $4011
       __8031: sta $770
       __8034: lda #$a5
       __8036: sta $7ff
       __8039: sta $7a7
       __803c: lda #$f
       __803e: sta $4015
       __8041: lda #$6
       __8043: sta $2001
       __8046: jsr __8220; 8220
       __8049: jsr __8e19; 8e19
       __804c: inc $774
       __804f: lda $778
       __8052: ora #$80
       __8054: jsr __8eed; 8eed
       __8057: jmp __8057 ;8057
cpu.tick()
       __8eed: sta $2000
       __8ef0: sta $778
       __8ef3: rts 
cpu.tick()
       __8e19: lda $2002
       __8e1c: lda $778
       __8e1f: ora #$10
       __8e21: and #$f0
       __8e23: jsr __8eed; 8eed
       __8e26: lda #$24
       __8e28: jsr __8e2d; 8e2d
       __8e2b: lda #$20
       __8e2d: sta $2006
       __8e30: lda #$0
       __8e32: sta $2006
       __8e35: ldx #$4
       __8e37: ldy #$c0
       __8e39: lda #$24
       __8e3b: sta $2007
       __8e3e: dey 
       __8e3f: bne __8e3b; 8e3b
       __8e41: dex 
       __8e42: bne __8e3b; 8e3b
       __8e44: ldy #$40
       __8e46: txa 
       __8e47: sta $300
       __8e4a: sta $301
       __8e4d: sta $2007
       __8e50: dey 
       __8e51: bne __8e4d; 8e4d
       __8e53: sta $73f
       __8e56: sta $740
       __8e59: jmp __8ee6 ;8ee6
cpu.tick()
       __8ee6: sta $2005
       __8ee9: sta $2005
       __8eec: rts 
cpu.tick()
       __8220: ldy #$0
       __8222: bit $4a0
       __8225: lda #$f8
       __8227: sta $200, y
       __822a: iny 
       __822b: iny 
       __822c: iny 
       __822d: iny 
       __822e: bne __8227; 8227
       __8230: rts 
cpu.tick()
       __90cc: ldx #$7
       __90ce: lda #$0
       __90d0: sta $6
       __90d2: stx $7
       __90d4: cpx #$1
       __90d6: bne __90dc; 90dc
       __90d8: cpy #$60
       __90da: bcs __90de; 90de
       __90dc: sta ($6), y
       __90de: dey 
       __90df: cpy #$ff
       __90e1: bne __90d4; 90d4
       __90e3: dex 
       __90e4: bpl __90d2; 90d2
       __90e6: rts 
cpu.tick()
       __8082: lda $778
       __8085: and #$7f
       __8087: sta $778
       __808a: and #$7e
       __808c: sta $2000
       __808f: lda $779
       __8092: and #$e6
       __8094: ldy $774
       __8097: bne __809e; 809e
       __8099: lda $779
       __809c: ora #$1e
       __809e: sta $779
       __80a1: and #$e7
       __80a3: sta $2001
       __80a6: ldx $2002
       __80a9: lda #$0
       __80ab: jsr __8ee6; 8ee6
       __80ae: sta $2003
       __80b1: lda #$2
       __80b3: sta $4014
       __80b6: ldx $773
       __80b9: lda $805a,x
       __80bc: sta $0
       __80be: lda $806d,x
       __80c1: sta $1
       __80c3: jsr __8edd; 8edd
       __80c6: ldy #$0
       __80c8: ldx $773
       __80cb: cpx #$6
       __80cd: bne __80d0; 80d0
       __80cf: iny 
       __80d0: ldx $8080, y
       __80d3: lda #$0
       __80d5: sta $300,x
       __80d8: sta $301,x
       __80db: sta $773
       __80de: lda $779
       __80e1: sta $2001
       __80e4: jsr __f2d1; f2d1
       __80e7: jsr __8e5c; 8e5c
       __80ea: jsr __8182; 8182
       __80ed: jsr __8f97; 8f97
       __80f0: lda $776
       __80f3: lsr a
       __80f4: bcs __811b; 811b
       __80f6: lda $747
       __80f9: beq __8100; 8100
       __80fb: dec $747
       __80fe: bne __8119; 8119
       __8100: ldx #$14
       __8102: dec $77f
       __8105: bpl __810e; 810e
       __8107: lda #$11
       __8109: sta $77f
       __810c: ldx #$23
       __810e: lda $780,x
       __8111: beq __8116; 8116
       __8113: dec $780,x
       __8116: dex 
       __8117: bpl __810e; 810e
       __8119: inc $9
       __811b: ldx #$0
       __811d: ldy #$7
       __811f: lda $7a7
       __8122: and #$2
       __8124: sta $0
       __8126: lda $7a8
       __8129: and #$2
       __812b: eor $0
       __812d: clc 
       __812e: beq __8131; 8131
       __8130: sec 
       __8131: ror $7a7,x
       __8134: inx 
       __8135: dey 
       __8136: bne __8131; 8131
       __8138: lda $722
       __813b: beq __815c; 815c
       __813d: lda $2002
       __8140: and #$40
       __8142: bne __813d; 813d
       __8144: lda $776
       __8147: lsr a
       __8148: bcs __8150; 8150
       __814a: jsr __8223; 8223
       __814d: jsr __81c6; 81c6
       __8150: lda $2002
       __8153: and #$40
       __8155: beq __8150; 8150
       __8157: ldy #$14
       __8159: dey 
       __815a: bne __8159; 8159
       __815c: lda $73f
       __815f: sta $2005
       __8162: lda $740
       __8165: sta $2005
       __8168: lda $778
       __816b: pha 
       __816c: sta $2000
       __816f: lda $776
       __8172: lsr a
       __8173: bcs __8178; 8178
       __8175: jsr __8212; 8212
       __8178: lda $2002
       __817b: pla 
       __817c: ora #$80
       __817e: sta $2000
       __8181: rti 
cpu.tick()
       __8212: lda $770
       __8215: jsr __8e04; 8e04
       __8218: and ($82), y
       erro 
next @       
(anonymous) @       
cpu.tick()
       __8e04: asl a
       __8e05: tay 
       __8e06: pla 
       __8e07: sta $4
       __8e09: pla 
       __8e0a: sta $5
       __8e0c: iny 
       __8e0d: lda ($4), y
       __8e0f: sta $6
       __8e11: iny 
       __8e12: lda ($4), y
       __8e14: sta $7
       __8e16: jmp ($6)
cpu.tick()
       __81c6: ldy $74e
       __81c9: lda #$28
       __81cb: sta $0
       __81cd: ldx #$e
       __81cf: lda $6e4,x
       __81d2: cmp $0
       __81d4: bcc __81e5; 81e5
       __81d6: ldy $6e0
       __81d9: clc 
       __81da: adc $6e1, y
       __81dd: bcc __81e2; 81e2
       __81df: clc 
       __81e0: adc $0
       __81e2: sta $6e4,x
       __81e5: dex 
       __81e6: bpl __81cf; 81cf
       __81e8: ldx $6e0
       __81eb: inx 
       __81ec: cpx #$3
       __81ee: bne __81f2; 81f2
       __81f0: ldx #$0
       __81f2: stx $6e0
       __81f5: ldx #$8
       __81f7: ldy #$2
       __81f9: lda $6e9, y
       __81fc: sta $6f1,x
       __81ff: clc 
       __8200: adc #$8
       __8202: sta $6f2,x
       __8205: clc 
       __8206: adc #$8
       __8208: sta $6f3,x
       __820b: dex 
       __820c: dex 
       __820d: dex 
       __820e: dey 
       __820f: bpl __81f9; 81f9
       __8211: rts 
cpu.tick()
       __8223: ldy #$4
       __8f97: ldx #$5
       __8f99: jsr __8f9e; 8f9e
       __8f9c: ldx #$b
       __8f9e: ldy #$5
       __8fa0: sec 
       __8fa1: lda $7dd,x
       __8fa4: sbc $7d7, y
       __8fa7: dex 
       __8fa8: dey 
       __8fa9: bpl __8fa1; 8fa1
       __8fab: bcc __8fbb; 8fbb
       __8fad: inx 
       __8fae: iny 
       __8faf: lda $7dd,x
       __8fb2: sta $7d7, y
       __8fb5: inx 
       __8fb6: iny 
       __8fb7: cpy #$6
       __8fb9: bcc __8faf; 8faf
       __8fbb: rts 
cpu.tick()
       __8182: lda $770
       __8185: cmp #$2
       __8187: beq __8194; 8194
       __8189: cmp #$1
       __818b: bne __81c5; 81c5
       __818d: lda $772
       __8190: cmp #$3
       __8192: bne __81c5; 81c5
       __8194: lda $777
       __8197: beq __819d; 819d
       __8199: dec $777
       __819c: rts 
cpu.tick()
       __819d: lda $6fc
       __81a0: and #$10
       __81a2: beq __81bd; 81bd
       __81a4: lda $776
       __81a7: and #$80
       __81a9: bne __81c5; 81c5
       __81ab: lda #$2b
       __81ad: sta $777
       __81b0: lda $776
       __81b3: tay 
       __81b4: iny 
       __81b5: sty $fa
       __81b7: eor #$1
       __81b9: ora #$80
       __81bb: bne __81c2; 81c2
       __81bd: lda $776
       __81c0: and #$7f
       __81c2: sta $776
       __81c5: rts 
cpu.tick()
       __8e5c: lda #$1
       __8e5e: sta $4016
       __8e61: lsr a
       __8e62: tax 
       __8e63: sta $4016
       __8e66: jsr __8e6a; 8e6a
       __8e69: inx 
       __8e6a: ldy #$8
       __8e6c: pha 
       __8e6d: lda $4016,x
       __8e70: sta $0
       __8e72: lsr a
       __8e73: ora $0
       __8e75: lsr a
       __8e76: pla 
       __8e77: rol a
       __8e78: dey 
       __8e79: bne __8e6c; 8e6c
       __8e7b: sta $6fc,x
       __8e7e: pha 
       __8e7f: and #$30
       __8e81: and $74a,x
       __8e84: beq __8e8d; 8e8d
       __8e86: pla 
       __8e87: and #$cf
       __8e89: sta $6fc,x
       __8e8c: rts 
cpu.tick()
       __8e8d: pla 
       __8e8e: sta $74a,x
       __8e91: rts 
cpu.tick()
       __f2d1: lda $770
       __f2d4: bne __f2da; f2da
       __f2d6: sta $4015
       __f2d9: rts 
cpu.tick()
       __f2da: lda #$ff
       __f2dc: sta $4017
       __f2df: lda #$f
       __f2e1: sta $4015
       __f2e4: lda $7c6
       __f2e7: bne __f2ef; f2ef
       __f2e9: lda $fa
       __f2eb: cmp #$1
       __f2ed: bne __f34c; f34c
       __f2ef: lda $7b2
       __f2f2: bne __f317; f317
       __f2f4: lda $fa
       __f2f6: beq __f35e; f35e
       __f2f8: sta $7b2
       __f2fb: sta $7c6
       __f2fe: lda #$0
       __f300: sta $4015
       __f303: sta $f1
       __f305: sta $f2
       __f307: sta $f3
       __f309: lda #$f
       __f30b: sta $4015
       __f30e: lda #$2a
       __f310: sta $7bb
       __f313: lda #$44
       __f315: bne __f328; f328
       __f317: lda $7bb
       __f31a: cmp #$24
       __f31c: beq __f326; f326
       __f31e: cmp #$1e
       __f320: beq __f313; f313
       __f322: cmp #$18
       __f324: bne __f32f; f32f
       __f326: lda #$64
       __f328: ldx #$84
       __f32a: ldy #$7f
       __f32c: jsr __f389; f389
       __f32f: dec $7bb
       __f332: bne __f35e; f35e
       __f334: lda #$0
       __f336: sta $4015
       __f339: lda $7b2
       __f33c: cmp #$2
       __f33e: bne __f345; f345
       __f340: lda #$0
       __f342: sta $7c6
       __f345: lda #$0
       __f347: sta $7b2
       __f34a: beq __f35e; f35e
       __f34c: jsr __f41c; f41c
       __f34f: jsr __f57d; f57d
       __f352: jsr __f668; f668
       __f355: jsr __f695; f695
       __f358: lda #$0
       __f35a: sta $fb
       __f35c: sta $fc
       __f35e: lda #$0
       __f360: sta $ff
       __f362: sta $fe
       __f364: sta $fd
       __f366: sta $fa
       __f368: ldy $7c0
       __f36b: lda $f4
       __f36d: and #$3
       __f36f: beq __f378; f378
       __f371: inc $7c0
       __f374: cpy #$30
       __f376: bcc __f37e; f37e
       __f378: tya 
       __f379: beq __f37e; f37e
       __f37b: dec $7c0
       __f37e: sty $4011
       __f381: rts 
cpu.tick()
       __f695: lda $fc
       __f697: bne __f6a5; f6a5
       __f699: lda $fb
       __f69b: bne __f6c9; f6c9
       __f69d: lda $7b1
       __f6a0: ora $f4
       __f6a2: bne __f692; f692
       __f6a4: rts 
cpu.tick()
       __f692: jmp __f73b ;f73b
cpu.tick()
       __f73b: dec $7b4
       __f73e: bne __f79f; f79f
       __f740: ldy $f7
       __f742: inc $f7
       __f744: lda ($f5), y
       __f746: beq __f74c; f74c
       __f748: bpl __f787; f787
       __f74a: bne __f77b; f77b
       __f74c: lda $7b1
       __f74f: cmp #$40
       __f751: bne __f758; f758
       __f753: lda $7c5
       __f756: bne __f775; f775
       __f758: and #$4
       __f75a: bne __f778; f778
       __f75c: lda $f4
       __f75e: and #$5f
       __f760: bne __f775; f775
       __f762: lda #$0
       __f764: sta $f4
       __f766: sta $7b1
       __f769: sta $4008
       __f76c: lda #$90
       __f76e: sta $4000
       __f771: sta $4004
       __f774: rts 
cpu.tick()
       __f775: jmp __f6d5 ;f6d5
cpu.tick()
       __f6d5: ldy #$0
       __f6d7: sty $7b1
       __f6da: sta $f4
       __f6dc: cmp #$1
       __f6de: bne __f6ee; f6ee
       __f6e0: inc $7c7
       __f6e3: ldy $7c7
       __f6e6: cpy #$32
       __f6e8: bne __f6f6; f6f6
       __f6ea: ldy #$11
       __f6ec: bne __f6d2; f6d2
       __f6ee: ldy #$8
       __f6f0: sty $f7
       __f6f2: iny 
       __f6f3: lsr a
       __f6f4: bcc __f6f2; f6f2
       __f6f6: lda $f90d, y
       __f6f9: tay 
       __f6fa: lda $f90e, y
       __f6fd: sta $f0
       __f6ff: lda $f90f, y
       __f702: sta $f5
       __f704: lda $f910, y
       __f707: sta $f6
       __f709: lda $f911, y
       __f70c: sta $f9
       __f70e: lda $f912, y
       __f711: sta $f8
       __f713: lda $f913, y
       __f716: sta $7b0
       __f719: sta $7c1
       __f71c: lda #$1
       __f71e: sta $7b4
       __f721: sta $7b6
       __f724: sta $7b9
       __f727: sta $7ba
       __f72a: lda #$0
       __f72c: sta $f7
       __f72e: sta $7ca
       __f731: lda #$b
       __f733: sta $4015
       __f736: lda #$f
       __f738: sta $4015
       __f6d2: sty $7c7
       __f778: jmp __f6a5 ;f6a5
cpu.tick()
       __f6a5: sta $7b1
       __f6a8: cmp #$1
       __f6aa: bne __f6b2; f6b2
       __f6ac: jsr __f4a8; f4a8
       __f6af: jsr __f572; f572
       __f6b2: ldx $f4
       __f6b4: stx $7c5
       __f6b7: ldy #$0
       __f6b9: sty $7c4
       __f6bc: sty $f4
       __f6be: cmp #$40
       __f6c0: bne __f6f2; f6f2
       __f6c2: ldx #$8
       __f6c4: stx $7c4
       __f6c7: bne __f6f2; f6f2
       __f6c9: cmp #$4
       __f6cb: bne __f6d0; f6d0
       __f6cd: jsr __f4a8; f4a8
       __f6d0: ldy #$10
       __f4a8: ldx #$0
       __f4aa: stx $f1
       __f4ac: ldx #$e
       __f4ae: stx $4015
       __f4b1: ldx #$f
       __f4b3: stx $4015
       __f4b6: rts 
cpu.tick()
       __f572: ldx #$d
       __f574: stx $4015
       __f577: ldx #$f
       __f579: stx $4015
       __f57c: rts 
cpu.tick()
       __f77b: jsr __f8cc; f8cc
       __f77e: sta $7b3
       __f781: ldy $f7
       __f783: inc $f7
       __f785: lda ($f5), y
       __f787: ldx $f2
       __f789: bne __f799; f799
       __f78b: jsr __f3aa; f3aa
       __f78e: beq __f793; f793
       __f790: jsr __f8d9; f8d9
       __f793: sta $7b5
       __f796: jsr __f3a0; f3a0
       __f799: lda $7b3
       __f79c: sta $7b4
       __f79f: lda $f2
       __f7a1: bne __f7bd; f7bd
       __f7a3: lda $7b1
       __f7a6: and #$91
       __f7a8: bne __f7bd; f7bd
       __f7aa: ldy $7b5
       __f7ad: beq __f7b2; f7b2
       __f7af: dec $7b5
       __f7b2: jsr __f8f5; f8f5
       __f7b5: sta $4004
       __f7b8: ldx #$7f
       __f7ba: stx $4005
       __f7bd: ldy $f8
       __f7bf: beq __f81b; f81b
       __f7c1: dec $7b6
       __f7c4: bne __f7f8; f7f8
       __f7c6: ldy $f8
       __f7c8: inc $f8
       __f7ca: lda ($f5), y
       __f7cc: bne __f7dd; f7dd
       __f7ce: lda #$83
       __f7d0: sta $4000
       __f7d3: lda #$94
       __f7d5: sta $4001
       __f7d8: sta $7ca
       __f7db: bne __f7c6; f7c6
       __f7dd: jsr __f8c6; f8c6
       __f7e0: sta $7b6
       __f7e3: ldy $f1
       __f7e5: bne __f81b; f81b
       __f7e7: txa 
       __f7e8: and #$3e
       __f7ea: jsr __f38c; f38c
       __f7ed: beq __f7f2; f7f2
       __f7ef: jsr __f8d9; f8d9
       __f7f2: sta $7b7
       __f7f5: jsr __f382; f382
       __f7f8: lda $f1
       __f7fa: bne __f81b; f81b
       __f7fc: lda $7b1
       __f7ff: and #$91
       __f801: bne __f811; f811
       __f803: ldy $7b7
       __f806: beq __f80b; f80b
       __f808: dec $7b7
       __f80b: jsr __f8f5; f8f5
       __f80e: sta $4000
       __f811: lda $7ca
       __f814: bne __f818; f818
       __f816: lda #$7f
       __f818: sta $4001
       __f81b: lda $f9
       __f81d: dec $7b9
       __f820: bne __f86e; f86e
       __f822: ldy $f9
       __f824: inc $f9
       __f826: lda ($f5), y
       __f828: beq __f86b; f86b
       __f82a: bpl __f83f; f83f
       __f82c: jsr __f8cc; f8cc
       __f82f: sta $7b8
       __f832: lda #$1f
       __f834: sta $4008
       __f837: ldy $f9
       __f839: inc $f9
       __f83b: lda ($f5), y
       __f83d: beq __f86b; f86b
       __f83f: jsr __f3ae; f3ae
       __f842: ldx $7b8
       __f845: stx $7b9
       __f848: lda $7b1
       __f84b: and #$6e
       __f84d: bne __f855; f855
       __f84f: lda $f4
       __f851: and #$a
       __f853: beq __f86e; f86e
       __f855: txa 
       __f856: cmp #$12
       __f858: bcs __f869; f869
       __f85a: lda $7b1
       __f85d: and #$8
       __f85f: beq __f865; f865
       __f861: lda #$f
       __f863: bne __f86b; f86b
       __f865: lda #$1f
       __f867: bne __f86b; f86b
       __f869: lda #$ff
       __f86b: sta $4008
       __f86e: lda $f4
       __f870: and #$f3
       __f872: beq __f8c5; f8c5
       __f874: dec $7ba
       __f877: bne __f8c5; f8c5
       __f879: ldy $7b0
       __f87c: inc $7b0
       __f87f: lda ($f5), y
       __f881: bne __f88b; f88b
       __f883: lda $7c1
       __f886: sta $7b0
       __f889: bne __f879; f879
       __f88b: jsr __f8c6; f8c6
       __f88e: sta $7ba
       __f891: txa 
       __f892: and #$3e
       __f894: beq __f8ba; f8ba
       __f896: cmp #$30
       __f898: beq __f8b2; f8b2
       __f89a: cmp #$20
       __f89c: beq __f8aa; f8aa
       __f89e: and #$10
       __f8a0: beq __f8ba; f8ba
       __f8a2: lda #$1c
       __f8a4: ldx #$3
       __f8a6: ldy #$18
       __f8a8: bne __f8bc; f8bc
       __f8aa: lda #$1c
       __f8ac: ldx #$c
       __f8ae: ldy #$18
       __f8b0: bne __f8bc; f8bc
       __f8b2: lda #$1c
       __f8b4: ldx #$3
       __f8b6: ldy #$58
       __f8b8: bne __f8bc; f8bc
       __f8ba: lda #$10
       __f8bc: sta $400c
       __f8bf: stx $400e
       __f8c2: sty $400f
       __f8c5: rts 
cpu.tick()
       __f8c6: tax 
       __f8c7: ror a
       __f8c8: txa 
       __f8c9: rol a
       __f8ca: rol a
       __f8cb: rol a
       __f8cc: and #$7
       __f8ce: clc 
       __f8cf: adc $f0
       __f8d1: adc $7c4
       __f8d4: tay 
       __f8d5: lda $ff66, y
       __f8d8: rts 
cpu.tick()
       __f3ae: ldx #$8
       __f3b0: bne __f38e; f38e
       erro 
next @       
(anonymous) @       
cpu.tick()
       __f38e: tay 
       __f38f: lda $ff01, y
       __f392: beq __f39f; f39f
       __f394: sta $4002,x
       __f397: lda $ff00, y
       __f39a: ora #$8
       __f39c: sta $4003,x
       __f39f: rts 
cpu.tick()
       __f8f5: lda $7b1
       __f8f8: and #$8
       __f8fa: beq __f900; f900
       __f8fc: lda $ff96, y
       __f8ff: rts 
cpu.tick()
       __f900: lda $f4
       __f902: and #$7d
       __f904: beq __f90a; f90a
       __f906: lda $ff9a, y
       __f909: rts 
cpu.tick()
       __f90a: lda $ffa2, y
       __f90d: rts 
cpu.tick()
       __f382: sty $4001
       __f385: stx $4000
       __f388: rts 
cpu.tick()
       __f8d9: lda $7b1
       __f8dc: and #$8
       __f8de: beq __f8e4; f8e4
       __f8e0: lda #$4
       __f8e2: bne __f8f0; f8f0
       __f8e4: lda $f4
       __f8e6: and #$7d
       __f8e8: beq __f8ee; f8ee
       __f8ea: lda #$8
       __f8ec: bne __f8f0; f8f0
       __f8ee: lda #$28
       __f8f0: ldx #$82
       __f8f2: ldy #$7f
       __f8f4: rts 
cpu.tick()
       __f38c: ldx #$0
       __f3a0: stx $4004
       __f3a3: sty $4005
       __f3a6: rts 
cpu.tick()
       __f3aa: ldx #$4
       __f3ac: bne __f38e; f38e
       __f668: ldy $fd
       __f66a: beq __f676; f676
       __f66c: sty $f3
       __f66e: lsr $fd
       __f670: bcs __f63c; f63c
       __f672: lsr $fd
       __f674: bcs __f681; f681
       __f676: lda $f3
       __f678: beq __f680; f680
       __f67a: lsr a
       __f67b: bcs __f641; f641
       __f67d: lsr a
       __f67e: bcs __f686; f686
       __f680: rts 
cpu.tick()
       __f686: lda $7bf
       __f689: lsr a
       __f68a: tay 
       __f68b: ldx #$f
       __f68d: lda $ffc9, y
       __f690: bne __f64e; f64e
       __f64e: sta $400c
       __f651: stx $400e
       __f654: lda #$18
       __f656: sta $400f
       __f659: dec $7bf
       __f65c: bne __f667; f667
       __f65e: lda #$f0
       __f660: sta $400c
       __f663: lda #$0
       __f665: sta $f3
       __f667: rts 
cpu.tick()
       __f641: lda $7bf
       __f644: lsr a
       __f645: bcc __f659; f659
       __f647: tay 
       __f648: ldx $f62c, y
       __f64b: lda $ffea, y
       __f681: lda #$40
       __f683: sta $7bf
       __f63c: lda #$20
       __f63e: sta $7bf
       __f57d: lda $f2
       __f57f: and #$40
       __f581: bne __f5e8; f5e8
       __f583: ldy $fe
       __f585: beq __f5a7; f5a7
       __f587: sty $f2
       __f589: bmi __f5c9; f5c9
       __f58b: lsr $fe
       __f58d: bcs __f519; f519
       __f58f: lsr $fe
       __f591: bcs __f5fd; f5fd
       __f593: lsr $fe
       __f595: bcs __f601; f601
       __f597: lsr $fe
       __f599: bcs __f53b; f53b
       __f59b: lsr $fe
       __f59d: bcs __f51f; f51f
       __f59f: lsr $fe
       __f5a1: bcs __f553; f553
       __f5a3: lsr $fe
       __f5a5: bcs __f5e3; f5e3
       __f5a7: lda $f2
       __f5a9: beq __f5c2; f5c2
       __f5ab: bmi __f5d4; f5d4
       __f5ad: lsr a
       __f5ae: bcs __f5c3; f5c3
       __f5b0: lsr a
       __f5b1: bcs __f610; f610
       __f5b3: lsr a
       __f5b4: bcs __f610; f610
       __f5b6: lsr a
       __f5b7: bcs __f546; f546
       __f5b9: lsr a
       __f5ba: bcs __f5c3; f5c3
       __f5bc: lsr a
       __f5bd: bcs __f558; f558
       __f5bf: lsr a
       __f5c0: bcs __f5e8; f5e8
       __f5c2: rts 
cpu.tick()
       __f5e8: lda $7bd
       __f5eb: ldx #$3
       __f5ed: lsr a
       __f5ee: bcs __f5c6; f5c6
       __f5f0: dex 
       __f5f1: bne __f5ed; f5ed
       __f5f3: tay 
       __f5f4: lda $f4d4, y
       __f5f7: ldx #$82
       __f5f9: ldy #$7f
       __f5fb: bne __f5e1; f5e1
       __f5fd: lda #$10
       __f5ff: bne __f603; f603
       __f601: lda #$20
       __f603: sta $7bd
       __f606: lda #$7f
       __f608: sta $4005
       __f60b: lda #$0
       __f60d: sta $7be
       __f610: inc $7be
       __f613: lda $7be
       __f616: lsr a
       __f617: tay 
       __f618: cpy $7bd
       __f61b: beq __f629; f629
       __f61d: lda #$9d
       __f61f: sta $4004
       __f622: lda $f4f9, y
       __f625: jsr __f3aa; f3aa
       __f628: rts 
cpu.tick()
       __f629: jmp __f56e ;f56e
cpu.tick()
       __f56e: ldx #$0
       __f570: stx $f2
       __f5e1: bne __f566; f566
       __f5e3: lda #$30
       __f5e5: sta $7bd
       __f566: jsr __f3a7; f3a7
       __f569: dec $7bd
       __f56c: bne __f57c; f57c
       __f3a7: jsr __f3a0; f3a0
       __f5c6: jmp __f569 ;f569
cpu.tick()
       __f558: lda $7bd
       __f55b: lsr a
       __f55c: bcs __f569; f569
       __f55e: tay 
       __f55f: lda $f4da, y
       __f562: ldx #$5d
       __f564: ldy #$7f
       __f5c3: jmp __f52d ;f52d
cpu.tick()
       __f52d: lda $7bd
       __f530: cmp #$30
       __f532: bne __f539; f539
       __f534: lda #$4e
       __f536: sta $4006
       __f539: bne __f569; f569
       __f53b: lda #$20
       __f53d: sta $7bd
       __f540: ldy #$94
       __f542: lda #$5e
       __f544: bne __f551; f551
       __f546: lda $7bd
       __f549: cmp #$18
       __f54b: bne __f569; f569
       __f54d: ldy #$93
       __f54f: lda #$18
       __f551: bne __f5d2; f5d2
       __f553: lda #$36
       __f555: sta $7bd
       __f5d2: bne __f5df; f5df
       __f5d4: lda $7bd
       __f5d7: cmp #$8
       __f5d9: bne __f569; f569
       __f5db: ldy #$a4
       __f5dd: lda #$5a
       __f5df: ldx #$9f
       __f51f: lda #$6
       __f521: ldx #$98
       __f523: sta $7bd
       __f526: ldy #$7f
       __f528: lda #$42
       __f52a: jsr __f3a7; f3a7
       __f519: lda #$35
       __f51b: ldx #$8d
       __f51d: bne __f523; f523
       __f5c9: lda #$38
       __f5cb: sta $7bd
       __f5ce: ldy #$c4
       __f5d0: lda #$18
       __f41c: ldy $ff
       __f41e: beq __f440; f440
       __f420: sty $f1
       __f422: bmi __f3ce; f3ce
       __f424: lsr $ff
       __f426: bcs __f3d2; f3d2
       __f428: lsr $ff
       __f42a: bcs __f400; f400
       __f42c: lsr $ff
       __f42e: bcs __f45c; f45c
       __f430: lsr $ff
       __f432: bcs __f47e; f47e
       __f434: lsr $ff
       __f436: bcs __f4b7; f4b7
       __f438: lsr $ff
       __f43a: bcs __f3fa; f3fa
       __f43c: lsr $ff
       __f43e: bcs __f3c0; f3c0
       __f440: lda $f1
       __f442: beq __f45b; f45b
       __f444: bmi __f3e0; f3e0
       __f446: lsr a
       __f447: bcs __f3e0; f3e0
       __f449: lsr a
       __f44a: bcs __f40e; f40e
       __f44c: lsr a
       __f44d: bcs __f46a; f46a
       __f44f: lsr a
       __f450: bcs __f48e; f48e
       __f452: lsr a
       __f453: bcs __f4bc; f4bc
       __f455: lsr a
       __f456: bcs __f40e; f40e
       __f458: lsr a
       __f459: bcs __f4a3; f4a3
       __f45b: rts 
cpu.tick()
       __f4a3: dec $7bb
       __f4a6: bne __f4b6; f4b6
       __f40e: lda $7bb
       __f411: cmp #$6
       __f413: bne __f41a; f41a
       __f415: lda #$bb
       __f417: sta $4001
       __f41a: bne __f47c; f47c
       __f47c: bne __f4a3; f4a3
       __f47e: lda #$e
       __f480: ldy #$cb
       __f482: ldx #$9f
       __f484: sta $7bb
       __f487: lda #$28
       __f489: jsr __f389; f389
       __f48c: bne __f4a3; f4a3
       __f48e: ldy $7bb
       __f491: cpy #$8
       __f493: bne __f49e; f49e
       __f495: lda #$a0
       __f497: sta $4002
       __f49a: lda #$9f
       __f49c: bne __f4a0; f4a0
       __f49e: lda #$90
       __f4a0: sta $4000
       __f389: jsr __f382; f382
       __f4bc: lda $7bb
       __f4bf: lsr a
       __f4c0: bcs __f4d2; f4d2
       __f4c2: lsr a
       __f4c3: bcs __f4d2; f4d2
       __f4c5: and #$2
       __f4c7: beq __f4d2; f4d2
       __f4c9: ldy #$91
       __f4cb: ldx #$9a
       __f4cd: lda #$44
       __f4cf: jsr __f389; f389
       __f4d2: jmp __f4a3 ;f4a3
cpu.tick()
       __f46a: ldy $7bb
       __f46d: lda $f3b1, y
       __f470: sta $4000
       __f473: cpy #$6
       __f475: bne __f47c; f47c
       __f477: lda #$9e
       __f479: sta $4002
       __f3e0: lda $7bb
       __f3e3: cmp #$25
       __f3e5: bne __f3ed; f3ed
       __f3e7: ldx #$5f
       __f3e9: ldy #$f6
       __f3eb: bne __f3f5; f3f5
       __f3ed: cmp #$20
       __f3ef: bne __f41a; f41a
       __f3f1: ldx #$48
       __f3f3: ldy #$bc
       __f3f5: jsr __f382; f382
       __f3f8: bne __f41a; f41a
       __f3fa: lda #$5
       __f3fc: ldy #$99
       __f3fe: bne __f404; f404
       __f400: lda #$a
       __f402: ldy #$93
       __f404: ldx #$9e
       __f406: sta $7bb
       __f409: lda #$c
       __f40b: jsr __f389; f389
       __f3c0: lda #$40
       __f3c2: sta $7bb
       __f3c5: lda #$62
       __f3c7: jsr __f38c; f38c
       __f3ca: ldx #$99
       __f3cc: bne __f3f3; f3f3
       __f3ce: lda #$26
       __f3d0: bne __f3d4; f3d4
       __f3d2: lda #$18
       __f3d4: ldx #$82
       __f3d6: ldy #$a7
       __f3d8: jsr __f389; f389
       __f3db: lda #$28
       __f3dd: sta $7bb
       __f4b7: lda #$2f
       __f4b9: sta $7bb
       __f45c: lda #$e
       __f45e: sta $7bb
       __f461: ldy #$9c
       __f463: ldx #$9e
       __f465: lda #$26
       __f467: jsr __f389; f389
       __8edd: ldx $2002
       __8ee0: ldy #$0
       __8ee2: lda ($0), y
       __8ee4: bne __8e92; 8e92
       __8e92: sta $2006
       __8e95: iny 
       __8e96: lda ($0), y
       __8e98: sta $2006
       __8e9b: iny 
       __8e9c: lda ($0), y
       __8e9e: asl a
       __8e9f: pha 
       __8ea0: lda $778
       __8ea3: ora #$4
       __8ea5: bcs __8ea9; 8ea9
       __8ea7: and #$fb
       __8ea9: jsr __8eed; 8eed
       __8eac: pla 
       __8ead: asl a
       __8eae: bcc __8eb3; 8eb3
       __8eb0: ora #$2
       __8eb2: iny 
       __8eb3: lsr a
       __8eb4: lsr a
       __8eb5: tax 
       __8eb6: bcs __8eb9; 8eb9
       __8eb8: iny 
       __8eb9: lda ($0), y
       __8ebb: sta $2007
       __8ebe: dex 
       __8ebf: bne __8eb6; 8eb6
       __8ec1: sec 
       __8ec2: tya 
       __8ec3: adc $0
       __8ec5: sta $0
       __8ec7: lda #$0
       __8ec9: adc $1
       __8ecb: sta $1
       __8ecd: lda #$3f
       __8ecf: sta $2006
       __8ed2: lda #$0
       __8ed4: sta $2006
       __8ed7: sta $2006
       __8eda: sta $2006