.org $8000
$8000: sei 
$8001: cld 
$8002: lda #$10
$8004: sta $2000
$8007: ldx #$ff
$8009: txs 
$800a: lda $2002
$800d: bpl $fb; 800a
$800f: lda $2002
$8012: bpl $fb; 800f
$8014: ldy #$fe
$8016: ldx #$5
$8018: lda $7d7,x
$801b: cmp #$a
$801d: bcs $c; 802b
$801f: dec 
$8020: bpl $f6; 8018
$8022: lda $7ff
$8025: cmp #$a5
$8027: bne $2; 802b
$8029: ldy #$d6
$802b: jsr $90cc; 90cc
$802e: sta $4011
$8031: sta $770
$8034: lda #$a5
$8036: sta $7ff
$8039: sta $7a7
$803c: lda #$f
$803e: sta $4015
$8041: lda #$6
$8043: sta $2001
$8046: jsr $8220; 8220
$8049: jsr $8e19; 8e19
$804c: inc $774
$804f: lda $778
$8052: ora #$80
$8054: jsr $8eed; 8eed
$8057: jmp $8057 ;8057

.org $8220
$8220: ldy #$0
$8222: bit $4a0
$8225: lda #$f8
$8227: sta $200, y
$822a: iny 
$822b: iny 
$822c: iny 
$822d: iny 
$822e: bne $f7; 8227
$8230: rts 


.org $8e19
$8e19: lda $2002
$8e1c: lda $778
$8e1f: ora #$10
$8e21: and #$f0
$8e23: jsr $8eed; 8eed
$8e26: lda #$24
$8e28: jsr $8e2d; 8e2d
$8e2b: lda #$20
$8e2d: sta $2006
$8e30: lda #$0
$8e32: sta $2006
$8e35: ldx #$4
$8e37: ldy #$c0
$8e39: lda #$24
$8e3b: sta $2007
$8e3e: dec 
$8e3f: bne $fa; 8e3b
$8e41: dec 
$8e42: bne $f7; 8e3b
$8e44: ldy #$40
$8e46: txa 
$8e47: sta $300
$8e4a: sta $301
$8e4d: sta $2007
$8e50: dec 
$8e51: bne $fa; 8e4d
$8e53: sta $73f
$8e56: sta $740
$8e59: jmp $8ee6 ;8ee6

.org $8ee6
$8ee6: sta $2005
$8ee9: sta $2005
$8eec: rts 



.org $8eed
$8eed: sta $2000
$8ef0: sta $778
$8ef3: rts 



.org $90cc
$90cc: ldx #$7
$90ce: lda #$0
$90d0: sta $6
$90d2: stx $7
$90d4: cpx #$1
$90d6: bne $4; 90dc
$90d8: cpy #$60
$90da: bcs $2; 90de
$90dc: sta ($6), y
$90de: dec 
$90df: cpy #$ff
$90e1: bne $f1; 90d4
$90e3: dec 
$90e4: bpl $ec; 90d2
$90e6: rts 

