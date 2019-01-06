
Start:
             sei                          
             cld
             lda #%00010000               
             sta PPU_CTRL_REG1
             ldx #$ff                     
             txs
VBlank1:     lda PPU_STATUS               
             bpl VBlank1
VBlank2:     lda PPU_STATUS
             bpl VBlank2
             ldy #ColdBootOffset          
             ldx #$05                     
WBootCheck:  lda TopScoreDisplay,x        
             cmp #10                      
             bcs ColdBoot                 
             dex                      
             bpl WBootCheck
             lda WarmBootValidation       
             cmp #$a5                     
             bne ColdBoot   
             ldy #WarmBootOffset          
ColdBoot:    jsr InitializeMemory         
             sta SND_DELTA_REG+1          
             sta OperMode                 
             lda #$a5                     
             sta WarmBootValidation     
             sta PseudoRandomBitReg       
             lda #%00001111
             sta SND_MASTERCTRL_REG       
             lda #%00000110
             sta PPU_CTRL_REG2            
             jsr MoveAllSpritesOffscreen
             jsr InitializeNameTables     
             inc DisableScreenFlag        
             lda Mirror_PPU_CTRL_REG1
             ora #%10000000               
             jsr WritePPUReg1
EndlessLoop: jmp EndlessLoop              



NonMaskableInterrupt:
               lda Mirror_PPU_CTRL_REG1  
               and #%01111111            
               sta Mirror_PPU_CTRL_REG1
               and #%01111110            
               sta PPU_CTRL_REG1         
               lda Mirror_PPU_CTRL_REG2  
               and #%11100110
               ldy DisableScreenFlag     
               bne ScreenOff             
               lda Mirror_PPU_CTRL_REG2  
               ora #%00011110
ScreenOff:     sta Mirror_PPU_CTRL_REG2  
               and #%11100111            
               sta PPU_CTRL_REG2
               ldx PPU_STATUS            
               lda #$00
               jsr InitScroll
               sta PPU_SPR_ADDR          
               lda #$02                  
               sta SPR_DMA
               ldx VRAM_Buffer_AddrCtrl  
               lda VRAM_AddrTable_Low,x  
               sta $00
               lda VRAM_AddrTable_High,x
               sta $01
               jsr UpdateScreen          
               ldy #$00
               ldx VRAM_Buffer_AddrCtrl  
               cpx #$06
               bne InitBuffer
               iny                       
InitBuffer:    ldx VRAM_Buffer_Offset,y
               lda #$00                  
               sta VRAM_Buffer1_Offset,x        
               sta VRAM_Buffer1,x
               sta VRAM_Buffer_AddrCtrl  
               lda Mirror_PPU_CTRL_REG2  
               sta PPU_CTRL_REG2
               jsr SoundEngine           
               jsr ReadJoypads           
               jsr PauseRoutine          
               jsr UpdateTopScore
               lda GamePauseStatus       
               lsr
               bcs PauseSkip
               lda TimerControl          
               beq DecTimers             
               dec TimerControl
               bne NoDecTimers
DecTimers:     ldx #$14                  
               dec IntervalTimerControl  
               bpl DecTimersLoop         
               lda #$14
               sta IntervalTimerControl  
               ldx #$23                  
DecTimersLoop: lda Timers,x              
               beq SkipExpTimer          
               dec Timers,x              
SkipExpTimer:  dex                       
               bpl DecTimersLoop         
NoDecTimers:   inc FrameCounter          
PauseSkip:     ldx #$00
               ldy #$07
               lda PseudoRandomBitReg    
               and #%00000010            
               sta $00                   
               lda PseudoRandomBitReg+1  
               and #%00000010            
               eor $00                   
               clc                       
               beq RotPRandomBit
               sec                       
RotPRandomBit: ror PseudoRandomBitReg,x  
               inx                       
               dey                       
               bne RotPRandomBit
               lda Sprite0HitDetectFlag  
               beq SkipSprite0
Sprite0Clr:    lda PPU_STATUS            
               and #%01000000            
               bne Sprite0Clr
               lda GamePauseStatus       
               lsr
               bcs Sprite0Hit
               jsr MoveSpritesOffscreen
               jsr SpriteShuffler
Sprite0Hit:    lda PPU_STATUS            
               and #%01000000
               beq Sprite0Hit
               ldy #$14                  
HBlankDelay:   dey
               bne HBlankDelay
SkipSprite0:   lda HorizontalScroll      
               sta PPU_SCROLL_REG
               lda VerticalScroll
               sta PPU_SCROLL_REG
               lda Mirror_PPU_CTRL_REG1  
               pha
               sta PPU_CTRL_REG1
               lda GamePauseStatus       
               lsr
               bcs SkipMainOper
               jsr OperModeExecutionTree 
SkipMainOper:  lda PPU_STATUS            
               pla
               ora #%10000000            
               sta PPU_CTRL_REG1
               rti                       



PauseRoutine:
               lda OperMode           
               cmp #VictoryModeValue  
               beq ChkPauseTimer
               cmp #GameModeValue     
               bne ExitPause          
               lda OperMode_Task      
               cmp #$03
               bne ExitPause          
ChkPauseTimer: lda GamePauseTimer     
               beq ChkStart
               dec GamePauseTimer     
               rts
ChkStart:      lda SavedJoypad1Bits   
               and #Start_Button      
               beq ClrPauseTimer
               lda GamePauseStatus    
               and #%10000000         
               bne ExitPause          
               lda #$2b               
               sta GamePauseTimer
               lda GamePauseStatus
               tay
               iny                    
               sty PauseSoundQueue
               eor #%00000001         
               ora #%10000000
               bne SetPause           
ClrPauseTimer: lda GamePauseStatus    
               and #%01111111         
SetPause:      sta GamePauseStatus
ExitPause:     rts




SpriteShuffler:
               ldy AreaType                
               lda #$28                    
               sta $00                     
               ldx #$0e                    
ShuffleLoop:   lda SprDataOffset,x         
               cmp $00                     
               bcc NextSprOffset           
               ldy SprShuffleAmtOffset     
               clc
               adc SprShuffleAmt,y         
               bcc StrSprOffset            
               clc
               adc $00                     
StrSprOffset:  sta SprDataOffset,x         
NextSprOffset: dex                         
               bpl ShuffleLoop
               ldx SprShuffleAmtOffset     
               inx
               cpx #$03                    
               bne SetAmtOffset            
               ldx #$00                    
SetAmtOffset:  stx SprShuffleAmtOffset
               ldx #$08                    
               ldy #$02
SetMiscOffset: lda SprDataOffset+5,y       
               sta Misc_SprDataOffset-2,x  
               clc                         
               adc #$08                    
               sta Misc_SprDataOffset-1,x  
               clc                         
               adc #$08
               sta Misc_SprDataOffset,x        
               dex
               dex
               dex
               dey
               bpl SetMiscOffset           
               rts



OperModeExecutionTree:
      lda OperMode     
      jsr JumpEngine   




MoveAllSpritesOffscreen:
              ldy #$00                


MoveSpritesOffscreen:
              ldy #$04                
              lda #$f8                
SprInitLoop:  sta Sprite_Y_Position,y 
              iny                     
              iny
              iny
              iny
              bne SprInitLoop
              rts



TitleScreenMode:
      lda OperMode_Task
      jsr JumpEngine
 

GameMenuRoutine:
              ldy #$00
              lda SavedJoypad1Bits        
              ora SavedJoypad2Bits        
              cmp #Start_Button
              beq StartGame
              cmp #A_Button+Start_Button  
              bne ChkSelect               
StartGame:    jmp ChkContinue             
ChkSelect:    cmp #Select_Button          
              beq SelectBLogic            
              ldx DemoTimer               
              bne ChkWorldSel             
              sta SelectTimer             
              jsr DemoEngine              
              bcs ResetTitle              
              jmp RunDemo                 
ChkWorldSel:  ldx WorldSelectEnableFlag   
              beq NullJoypad
              cmp #B_Button               
              bne NullJoypad
              iny                         
SelectBLogic: lda DemoTimer               
              beq ResetTitle              
              lda #$18                    
              sta DemoTimer
              lda SelectTimer             
              bne NullJoypad              
              lda #$10                    
              sta SelectTimer
              cpy #$01                    
              beq IncWorldSel             
              lda NumberOfPlayers         
              eor #%00000001              
              sta NumberOfPlayers
              jsr DrawMushroomIcon
              jmp NullJoypad
IncWorldSel:  ldx WorldSelectNumber       
              inx
              txa
              and #%00000111              
              sta WorldSelectNumber       
              jsr GoContinue
UpdateShroom: lda WSelectBufferTemplate,x 
              sta VRAM_Buffer1-1,x        
              inx
              cpx #$06
              bmi UpdateShroom
              ldy WorldNumber             
              iny                         
              sty VRAM_Buffer1+3          
NullJoypad:   lda #$00                    
              sta SavedJoypad1Bits
RunDemo:      jsr GameCoreRoutine         
              lda GameEngineSubroutine    
              cmp #$06
              bne ExitMenu                
ResetTitle:   lda #$00                    
              sta OperMode                
              sta OperMode_Task           
              sta Sprite0HitDetectFlag
              inc DisableScreenFlag
              rts
ChkContinue:  ldy DemoTimer               
              beq ResetTitle
              asl                         
              bcc StartWorld1             
              lda ContinueWorld           
              jsr GoContinue              
StartWorld1:  jsr LoadAreaPointer
              inc Hidden1UpFlag           
              inc OffScr_Hidden1UpFlag
              inc FetchNewGameTimerFlag   
              inc OperMode                
              lda WorldSelectEnableFlag   
              sta PrimaryHardMode         
              lda #$00
              sta OperMode_Task           
              sta DemoTimer
              ldx #$17
              lda #$00
InitScores:   sta ScoreAndCoinDisplay,x   
              dex
              bpl InitScores
ExitMenu:     rts
GoContinue:   sta WorldNumber             
              sta OffScr_WorldNumber      
              ldx #$00                    
              stx AreaNumber              
              stx OffScr_AreaNumber   
              rts
 
DrawMushroomIcon:
              ldy #$07                
IconDataRead: lda MushroomIconData,y  
              sta VRAM_Buffer1-1,y    
              dey
              bpl IconDataRead
              lda NumberOfPlayers     
              beq ExitIcon            
              lda #$24                
              sta VRAM_Buffer1+3
              lda #$ce                
              sta VRAM_Buffer1+5
ExitIcon:     rts


 
DemoEngine:
          ldx DemoAction         
          lda DemoActionTimer    
          bne DoAction           
          inx
          inc DemoAction         
          sec                    
          lda DemoTimingData-1,x 
          sta DemoActionTimer    
          beq DemoOver           
DoAction: lda DemoActionData-1,x 
          sta SavedJoypad1Bits
          dec DemoActionTimer    
          clc                    
DemoOver: rts



VictoryMode:
            jsr VictoryModeSubroutines  
            lda OperMode_Task           
            beq AutoPlayer              
            ldx #$00
            stx ObjectOffset            
            jsr EnemiesAndLoopsCore     
AutoPlayer: jsr RelativePlayerPosition  
            jmp PlayerGfxHandler        

VictoryModeSubroutines:
      lda OperMode_Task
      jsr JumpEngine
 


SetupVictoryMode:
      ldx ScreenRight_PageLoc  
      inx                      
      stx DestinationPageLoc   
      lda #EndOfCastleMusic
      sta EventMusicQueue      
      jmp IncModeTask_B        



PlayerVictoryWalk:
             ldy #$00                
             sty VictoryWalkControl
             lda Player_PageLoc      
             cmp DestinationPageLoc  
             bne PerformWalk         
             lda Player_X_Position   
             cmp #$60                
             bcs DontWalk            
PerformWalk: inc VictoryWalkControl  
             iny                     
DontWalk:    tya                     
             jsr AutoControlPlayer   
             lda ScreenLeft_PageLoc  
             cmp DestinationPageLoc  
             beq ExitVWalk           
             lda ScrollFractional
             clc                     
             adc #$80        
             sta ScrollFractional    
             lda #$01                
             adc #$00                
             tay                     
             jsr ScrollScreen        
             jsr UpdScrollVar        
             inc VictoryWalkControl  
ExitVWalk:   lda VictoryWalkControl  
             beq IncModeTask_A       
             rts                     



PrintVictoryMessages:
               lda SecondaryMsgCounter   
               bne IncMsgCounter         
               lda PrimaryMsgCounter     
               beq ThankPlayer           
               cmp #$09                  
               bcs IncMsgCounter         
               ldy WorldNumber           
               cpy #World8
               bne MRetainerMsg          
               cmp #$03                  
               bcc IncMsgCounter         
               sbc #$01                  
               jmp ThankPlayer           
MRetainerMsg:  cmp #$02                  
               bcc IncMsgCounter         
ThankPlayer:   tay                       
               bne SecondPartMsg         
               lda CurrentPlayer         
               beq EvalForMusic          
               iny                       
               bne EvalForMusic          
SecondPartMsg: iny                       
               lda WorldNumber
               cmp #World8               
               beq EvalForMusic          
               dey                       
               cpy #$04                  
               bcs SetEndTimer           
               cpy #$03                  
               bcs IncMsgCounter         
EvalForMusic:  cpy #$03                  
               bne PrintMsg              
               lda #VictoryMusic         
               sta EventMusicQueue       
PrintMsg:      tya                       
               clc                       
               adc #$0c                  
               sta VRAM_Buffer_AddrCtrl  
IncMsgCounter: lda SecondaryMsgCounter
               clc
               adc #$04                      
               sta SecondaryMsgCounter
               lda PrimaryMsgCounter
               adc #$00                      
               sta PrimaryMsgCounter
               cmp #$07                      
SetEndTimer:   bcc ExitMsgs                  
               lda #$06
               sta WorldEndTimer             
IncModeTask_A: inc OperMode_Task             
ExitMsgs:      rts                           



PlayerEndWorld:
               lda WorldEndTimer          
               bne EndExitOne             
               ldy WorldNumber            
               cpy #World8                
               bcs EndChkBButton          
               lda #$00
               sta AreaNumber             
               sta LevelNumber            
               sta OperMode_Task          
               inc WorldNumber            
               jsr LoadAreaPointer        
               inc FetchNewGameTimerFlag  
               lda #GameModeValue
               sta OperMode               
EndExitOne:    rts                        
EndChkBButton: lda SavedJoypad1Bits
               ora SavedJoypad2Bits       
               and #B_Button              
               beq EndExitTwo             
               lda #$01                   
               sta WorldSelectEnableFlag
               lda #$ff                   
               sta NumberofLives
               jsr TerminateGame          
EndExitTwo:    rts                        

 
FloateyNumbersRoutine:
              lda FloateyNum_Control,x     
              beq EndExitOne               
              cmp #$0b                     
              bcc ChkNumTimer
              lda #$0b                     
              sta FloateyNum_Control,x     
ChkNumTimer:  tay                          
              lda FloateyNum_Timer,x       
              bne DecNumTimer              
              sta FloateyNum_Control,x     
              rts
DecNumTimer:  dec FloateyNum_Timer,x       
              cmp #$2b                     
              bne ChkTallEnemy
              cpy #$0b                     
              bne LoadNumTiles             
              inc NumberofLives            
              lda #Sfx_ExtraLife
              sta Square2SoundQueue        
LoadNumTiles: lda ScoreUpdateData,y        
              lsr                          
              lsr
              lsr
              lsr
              tax                          
              lda ScoreUpdateData,y        
              and #%00001111               
              sta DigitModifier,x          
              jsr AddToScore               
ChkTallEnemy: ldy Enemy_SprDataOffset,x    
              lda Enemy_ID,x               
              cmp #Spiny
              beq FloateyPart              
              cmp #PiranhaPlant
              beq FloateyPart              
              cmp #HammerBro
              beq GetAltOffset             
              cmp #GreyCheepCheep
              beq FloateyPart              
              cmp #RedCheepCheep
              beq FloateyPart
              cmp #TallEnemy
              bcs GetAltOffset             
              lda Enemy_State,x
              cmp #$02                     
              bcs FloateyPart              
GetAltOffset: ldx SprDataOffset_Ctrl       
              ldy Alt_SprDataOffset,x      
              ldx ObjectOffset             
FloateyPart:  lda FloateyNum_Y_Pos,x       
              cmp #$18                     
              bcc SetupNumSpr              
              sbc #$01
              sta FloateyNum_Y_Pos,x       
SetupNumSpr:  lda FloateyNum_Y_Pos,x       
              sbc #$08                     
              jsr DumpTwoSpr               
              lda FloateyNum_X_Pos,x       
              sta Sprite_X_Position,y      
              clc
              adc #$08                     
              sta Sprite_X_Position+4,y    
              lda #$02
              sta Sprite_Attributes,y      
              sta Sprite_Attributes+4,y    
              lda FloateyNum_Control,x
              asl                          
              tax                          
              lda FloateyNumTileData,x
              sta Sprite_Tilenumber,y      
              lda FloateyNumTileData+1,x
              sta Sprite_Tilenumber+4,y    
              ldx ObjectOffset             
              rts



ScreenRoutines:
      lda ScreenRoutineTask        
      jsr JumpEngine
 



InitScreen:
      jsr MoveAllSpritesOffscreen 
      jsr InitializeNameTables    
      lda OperMode
      beq NextSubtask             
      ldx #$03                    
      jmp SetVRAMAddr_A



SetupIntermediate:
      lda BackgroundColorCtrl  
      pha                      
      lda PlayerStatus
      pha
      lda #$00                 
      sta PlayerStatus         
      lda #$02                 
      sta BackgroundColorCtrl  
      jsr GetPlayerColors
      pla                      
      sta PlayerStatus         
      pla                      
      sta BackgroundColorCtrl  
      jmp IncSubtask           

 

GetAreaPalette:
               ldy AreaType             
               ldx AreaPalette,y        
SetVRAMAddr_A: stx VRAM_Buffer_AddrCtrl 
NextSubtask:   jmp IncSubtask           
 
 
GetBackgroundColor:
           ldy BackgroundColorCtrl   
           beq NoBGColor             
           lda BGColorCtrl_Addr-4,y  
           sta VRAM_Buffer_AddrCtrl  
NoBGColor: inc ScreenRoutineTask     
      
GetPlayerColors:
               ldx VRAM_Buffer1_Offset  
               ldy #$00
               lda CurrentPlayer        
               beq ChkFiery
               ldy #$04                 
ChkFiery:      lda PlayerStatus         
               cmp #$02
               bne StartClrGet          
               ldy #$08
StartClrGet:   lda #$03                 
               sta $00
ClrGetLoop:    lda PlayerColors,y       
               sta VRAM_Buffer1+3,x     
               iny
               inx
               dec $00
               bpl ClrGetLoop
               ldx VRAM_Buffer1_Offset  
               ldy BackgroundColorCtrl  
               bne SetBGColor           
               ldy AreaType             
SetBGColor:    lda BackgroundColors,y   
               sta VRAM_Buffer1+3,x
               lda #$3f                 
               sta VRAM_Buffer1,x       
               lda #$10
               sta VRAM_Buffer1+1,x
               lda #$04                 
               sta VRAM_Buffer1+2,x
               lda #$00                 
               sta VRAM_Buffer1+7,x
               txa                      
               clc                      
               adc #$07
SetVRAMOffset: sta VRAM_Buffer1_Offset  
               rts



GetAlternatePalette1:
               lda AreaStyle            
               cmp #$01
               bne NoAltPal
               lda #$0b                 
SetVRAMAddr_B: sta VRAM_Buffer_AddrCtrl
NoAltPal:      jmp IncSubtask           



WriteTopStatusLine:
      lda #$00          
      jsr WriteGameText 
      jmp IncSubtask    



WriteBottomStatusLine:
      jsr GetSBNybbles        
      ldx VRAM_Buffer1_Offset
      lda #$20                
      sta VRAM_Buffer1,x
      lda #$73
      sta VRAM_Buffer1+1,x
      lda #$03                
      sta VRAM_Buffer1+2,x
      ldy WorldNumber         
      iny
      tya
      sta VRAM_Buffer1+3,x
      lda #$28                
      sta VRAM_Buffer1+4,x
      ldy LevelNumber         
      iny                     
      tya
      sta VRAM_Buffer1+5,x    
      lda #$00                
      sta VRAM_Buffer1+6,x
      txa                     
      clc
      adc #$06
      sta VRAM_Buffer1_Offset
      jmp IncSubtask



DisplayTimeUp:
          lda GameTimerExpiredFlag  
          beq NoTimeUp              
          lda #$00
          sta GameTimerExpiredFlag  
          lda #$02                  
          jmp OutputInter
NoTimeUp: inc ScreenRoutineTask     
          jmp IncSubtask



DisplayIntermediate:
               lda OperMode                 
               beq NoInter                  
               cmp #GameOverModeValue       
               beq GameOverInter            
               lda AltEntranceControl       
               bne NoInter                  
               ldy AreaType                 
               cpy #$03                     
               beq PlayerInter
               lda DisableIntermediate      
               bne NoInter                  
PlayerInter:   jsr DrawPlayer_Intermediate  
               lda #$01                     
OutputInter:   jsr WriteGameText
               jsr ResetScreenTimer
               lda #$00
               sta DisableScreenFlag        
               rts
GameOverInter: lda #$12                     
               sta ScreenTimer
               lda #$03                     
               jsr WriteGameText
               jmp IncModeTask_B
NoInter:       lda #$08                     
               sta ScreenRoutineTask
               rts



AreaParserTaskControl:
           inc DisableScreenFlag     
TaskLoop:  jsr AreaParserTaskHandler 
           lda AreaParserTaskNum     
           bne TaskLoop              
           dec ColumnSets            
           bpl OutputCol
           inc ScreenRoutineTask     
OutputCol: lda #$06                  
           sta VRAM_Buffer_AddrCtrl  
           rts






DrawTitleScreen:
            lda OperMode                 
            bne IncModeTask_B            
            lda #>TitleScreenDataOffset  
            sta PPU_ADDRESS              
            lda #<TitleScreenDataOffset
            sta PPU_ADDRESS
            lda #$03                     
            sta $01                      
            ldy #$00
            sty $00
            lda PPU_DATA                 
OutputTScr: lda PPU_DATA                 
            sta ($00),y                  
            iny
            bne ChkHiByte                
            inc $01                      
ChkHiByte:  lda $01                      
            cmp #$04                     
            bne OutputTScr               
            cpy #$3a                     
            bcc OutputTScr               
            lda #$05                     
            jmp SetVRAMAddr_B            



ClearBuffersDrawIcon:
             lda OperMode               
             bne IncModeTask_B          
             ldx #$00                   
TScrClear:   sta VRAM_Buffer1-1,x
             sta VRAM_Buffer1-1+$100,x
             dex
             bne TScrClear
             jsr DrawMushroomIcon       
IncSubtask:  inc ScreenRoutineTask      
             rts



WriteTopScore:
               lda #$fa           
               jsr UpdateNumber
IncModeTask_B: inc OperMode_Task  
               rts



  
WriteGameText:
               pha                      
               asl
               tay                      
               cpy #$04                 
               bcc LdGameText           
               cpy #$08                 
               bcc Chk2Players          
               ldy #$08                 
Chk2Players:   lda NumberOfPlayers      
               bne LdGameText           
               iny                      
LdGameText:    ldx GameTextOffsets,y    
               ldy #$00
GameTextLoop:  lda GameText,x           
               cmp #$ff                 
               beq EndGameText          
               sta VRAM_Buffer1,y       
               inx                      
               iny
               bne GameTextLoop         
EndGameText:   lda #$00                 
               sta VRAM_Buffer1,y
               pla                      
               tax
               cmp #$04                 
               bcs PrintWarpZoneNumbers
               dex                      
               bne CheckPlayerName      
               lda NumberofLives        
               clc                      
               adc #$01
               cmp #10                  
               bcc PutLives
               sbc #10                  
               ldy #$9f                 
               sty VRAM_Buffer1+7       
PutLives:      sta VRAM_Buffer1+8
               ldy WorldNumber          
               iny                      
               sty VRAM_Buffer1+19
               ldy LevelNumber
               iny
               sty VRAM_Buffer1+21      
               rts

CheckPlayerName:
             lda NumberOfPlayers    
             beq ExitChkName        
             lda CurrentPlayer      
             dex                    
             bne ChkLuigi
             ldy OperMode           
             cpy #GameOverModeValue
             beq ChkLuigi
             eor #%00000001         
ChkLuigi:    lsr
             bcc ExitChkName        
             ldy #$04
NameLoop:    lda LuigiName,y        
             sta VRAM_Buffer1+3,y
             dey
             bpl NameLoop           
ExitChkName: rts

PrintWarpZoneNumbers:
             sbc #$04               
             asl                    
             asl                    
             tax
             ldy #$00
WarpNumLoop: lda WarpZoneNumbers,x  
             sta VRAM_Buffer1+27,y  
             inx
             iny                    
             iny
             iny
             iny
             cpy #$0c
             bcc WarpNumLoop
             lda #$2c               
             jmp SetVRAMOffset



ResetSpritesAndScreenTimer:
         lda ScreenTimer             
         bne NoReset                 
         jsr MoveAllSpritesOffscreen 

ResetScreenTimer:
         lda #$07                    
         sta ScreenTimer
         inc ScreenRoutineTask       
NoReset: rts











RenderAreaGraphics:
            lda CurrentColumnPos         
            and #$01
            sta $05
            ldy VRAM_Buffer2_Offset      
            sty $00
            lda CurrentNTAddr_Low        
            sta VRAM_Buffer2+1,y
            lda CurrentNTAddr_High
            sta VRAM_Buffer2,y
            lda #$9a                     
            sta VRAM_Buffer2+2,y         
            lda #$00                     
            sta $04
            tax
DrawMTLoop: stx $01                      
            lda MetatileBuffer,x         
            and #%11000000
            sta $03                      
            asl                          
            rol                          
            rol                          
            tay                          
            lda MetatileGraphics_Low,y   
            sta $06
            lda MetatileGraphics_High,y
            sta $07
            lda MetatileBuffer,x         
            asl                          
            asl
            sta $02
            lda AreaParserTaskNum        
            and #%00000001               
            eor #%00000001               
            asl                          
            adc $02                      
            tay
            ldx $00                      
            lda ($06),y
            sta VRAM_Buffer2+3,x         
            iny
            lda ($06),y                  
            sta VRAM_Buffer2+4,x
            ldy $04                      
            lda $05                      
            bne RightCheck               
            lda $01                      
            lsr                          
            bcs LLeft
            rol $03                      
            rol $03                      
            rol $03
            jmp SetAttrib
RightCheck: lda $01                      
            lsr                          
            bcs NextMTRow
            lsr $03                      
            lsr $03                      
            lsr $03
            lsr $03
            jmp SetAttrib
LLeft:      lsr $03                      
            lsr $03                      
NextMTRow:  inc $04                      
SetAttrib:  lda AttributeBuffer,y        
            ora $03                      
            sta AttributeBuffer,y        
            inc $00                      
            inc $00
            ldx $01                      
            inx                          
            cpx #$0d
            bcc DrawMTLoop               
            ldy $00                      
            iny                          
            iny
            iny
            lda #$00
            sta VRAM_Buffer2,y           
            sty VRAM_Buffer2_Offset      
            inc CurrentNTAddr_Low        
            lda CurrentNTAddr_Low        
            and #%00011111               
            bne ExitDrawM
            lda #$80                     
            sta CurrentNTAddr_Low        
            lda CurrentNTAddr_High       
            eor #%00000100               
            sta CurrentNTAddr_High
ExitDrawM:  jmp SetVRAMCtrl              





RenderAttributeTables:
             lda CurrentNTAddr_Low    
             and #%00011111           
             sec                      
             sbc #$04
             and #%00011111           
             sta $01
             lda CurrentNTAddr_High   
             bcs SetATHigh
             eor #%00000100           
SetATHigh:   and #%00000100           
             ora #$23                 
             sta $00
             lda $01                  
             lsr                      
             lsr
             adc #$c0                 
             sta $01                  
             ldx #$00
             ldy VRAM_Buffer2_Offset  
AttribLoop:  lda $00
             sta VRAM_Buffer2,y       
             lda $01
             clc                      
             adc #$08                 
             sta VRAM_Buffer2+1,y
             sta $01                  
             lda AttributeBuffer,x    
             sta VRAM_Buffer2+3,y     
             lda #$01
             sta VRAM_Buffer2+2,y     
             lsr
             sta AttributeBuffer,x    
             iny                      
             iny
             iny
             iny
             inx                      
             cpx #$07                 
             bcc AttribLoop
             sta VRAM_Buffer2,y       
             sty VRAM_Buffer2_Offset  
SetVRAMCtrl: lda #$06
             sta VRAM_Buffer_AddrCtrl 
             rts


 
ColorRotation:
              lda FrameCounter         
              and #$07                 
              bne ExitColorRot         
              ldx VRAM_Buffer1_Offset  
              cpx #$31
              bcs ExitColorRot         
              tay                      
GetBlankPal:  lda BlankPalette,y       
              sta VRAM_Buffer1,x       
              inx                      
              iny
              cpy #$08
              bcc GetBlankPal          
              ldx VRAM_Buffer1_Offset  
              lda #$03
              sta $00                  
              lda AreaType             
              asl                      
              asl
              tay                      
GetAreaPal:   lda Palette3Data,y       
              sta VRAM_Buffer1+3,x     
              iny
              inx
              dec $00                  
              bpl GetAreaPal           
              ldx VRAM_Buffer1_Offset  
              ldy ColorRotateOffset    
              lda ColorRotatePalette,y
              sta VRAM_Buffer1+4,x     
              lda VRAM_Buffer1_Offset
              clc                      
              adc #$07
              sta VRAM_Buffer1_Offset
              inc ColorRotateOffset    
              lda ColorRotateOffset
              cmp #$06                 
              bcc ExitColorRot         
              lda #$00
              sta ColorRotateOffset    
ExitColorRot: rts                      
 

RemoveCoin_Axe:
              ldy #$41                 
              lda #$03                 
              ldx AreaType             
              bne WriteBlankMT         
              lda #$04                 
WriteBlankMT: jsr PutBlockMetatile     
              lda #$06
              sta VRAM_Buffer_AddrCtrl 
              rts

ReplaceBlockMetatile:
       jsr WriteBlockMetatile    
       inc Block_ResidualCounter 
       dec Block_RepFlag,x       
       rts                       

DestroyBlockMetatile:
       lda #$00       

WriteBlockMetatile:
             ldy #$03                
             cmp #$00                
             beq UseBOffset          
             ldy #$00                
             cmp #$58
             beq UseBOffset          
             cmp #$51
             beq UseBOffset          
             iny                     
             cmp #$5d
             beq UseBOffset          
             cmp #$52
             beq UseBOffset          
             iny                     
UseBOffset:  tya                     
             ldy VRAM_Buffer1_Offset 
             iny                     
             jsr PutBlockMetatile    
MoveVOffset: dey                     
             tya                     
             clc
             adc #10
             jmp SetVRAMOffset       

PutBlockMetatile:
            stx $00               
            sty $01               
            asl
            asl                   
            tax
            ldy #$20              
            lda $06               
            cmp #$d0              
            bcc SaveHAdder        
            ldy #$24              
SaveHAdder: sty $03               
            and #$0f              
            asl                   
            sta $04               
            lda #$00
            sta $05               
            lda $02               
            clc
            adc #$20              
            asl
            rol $05               
            asl
            rol $05               
            adc $04               
            sta $04               
            lda $05               
            adc #$00              
            clc
            adc $03               
            sta $05               
            ldy $01               
RemBridge:  lda BlockGfxData,x    
            sta VRAM_Buffer1+2,y  
            lda BlockGfxData+1,x
            sta VRAM_Buffer1+3,y
            lda BlockGfxData+2,x  
            sta VRAM_Buffer1+7,y  
            lda BlockGfxData+3,x  
            sta VRAM_Buffer1+8,y
            lda $04
            sta VRAM_Buffer1,y    
            clc                   
            adc #$20              
            sta VRAM_Buffer1+5,y  
            lda $05               
            sta VRAM_Buffer1-1,y  
            sta VRAM_Buffer1+4,y  
            lda #$02
            sta VRAM_Buffer1+1,y  
            sta VRAM_Buffer1+6,y  
            lda #$00
            sta VRAM_Buffer1+9,y  
            ldx $00               
            rts                   
JumpEngine:
       asl          
       tay
       pla          
       sta $04      
       pla
       sta $05
       iny
       lda ($04),y  
       sta $06      
       iny          
       lda ($04),y  
       sta $07
       jmp ($06)    



InitializeNameTables:
              lda PPU_STATUS            
              lda Mirror_PPU_CTRL_REG1  
              ora #%00010000            
              and #%11110000            
              jsr WritePPUReg1
              lda #$24                  
              jsr WriteNTAddr
              lda #$20                  
WriteNTAddr:  sta PPU_ADDRESS
              lda #$00
              sta PPU_ADDRESS
              ldx #$04                  
              ldy #$c0
              lda #$24
InitNTLoop:   sta PPU_DATA              
              dey
              bne InitNTLoop
              dex
              bne InitNTLoop
              ldy #64                   
              txa
              sta VRAM_Buffer1_Offset   
              sta VRAM_Buffer1          
InitATLoop:   sta PPU_DATA
              dey
              bne InitATLoop
              sta HorizontalScroll      
              sta VerticalScroll
              jmp InitScroll            




ReadJoypads: 
              lda #$01               
              sta JOYPAD_PORT
              lsr
              tax                    
              sta JOYPAD_PORT
              jsr ReadPortBits
              inx                    
ReadPortBits: ldy #$08
PortLoop:     pha                    
              lda JOYPAD_PORT,x      
              sta $00                
              lsr                    
              ora $00                
              lsr
              pla                    
              rol                    
              dey
              bne PortLoop           
              sta SavedJoypadBits,x  
              pha
              and #%00110000         
              and JoypadBitMask,x    
              beq Save8Bits          
              pla
              and #%11001111         
              sta SavedJoypadBits,x  
              rts
Save8Bits:    pla
              sta JoypadBitMask,x    
              rts





WriteBufferToScreen:
               sta PPU_ADDRESS           
               iny
               lda ($00),y               
               sta PPU_ADDRESS           
               iny
               lda ($00),y               
               asl                       
               pha
               lda Mirror_PPU_CTRL_REG1  
               ora #%00000100            
               bcs SetupWrites           
               and #%11111011            
SetupWrites:   jsr WritePPUReg1          
               pla                       
               asl
               bcc GetLength             
               ora #%00000010            
               iny
GetLength:     lsr                       
               lsr                       
               tax
OutputToVRAM:  bcs RepeatByte            
               iny                       
RepeatByte:    lda ($00),y               
               sta PPU_DATA
               dex                       
               bne OutputToVRAM
               sec          
               tya
               adc $00                   
               sta $00                   
               lda #$00
               adc $01
               sta $01
               lda #$3f                  
               sta PPU_ADDRESS
               lda #$00
               sta PPU_ADDRESS
               sta PPU_ADDRESS           
               sta PPU_ADDRESS
UpdateScreen:  ldx PPU_STATUS            
               ldy #$00                  
               lda ($00),y  
               bne WriteBufferToScreen   
InitScroll:    sta PPU_SCROLL_REG        
               sta PPU_SCROLL_REG        
               rts



WritePPUReg1:
               sta PPU_CTRL_REG1         
               sta Mirror_PPU_CTRL_REG1  
               rts

 
PrintStatusBarNumbers:
      sta $00            
      jsr OutputNumbers  
      lda $00            
      lsr                
      lsr
      lsr
      lsr

OutputNumbers:
             clc                      
             adc #$01
             and #%00001111           
             cmp #$06
             bcs ExitOutputN
             pha                      
             asl                      
             tay
             ldx VRAM_Buffer1_Offset  
             lda #$20                 
             cpy #$00                 
             bne SetupNums
             lda #$22                 
SetupNums:   sta VRAM_Buffer1,x
             lda StatusBarData,y      
             sta VRAM_Buffer1+1,x     
             lda StatusBarData+1,y
             sta VRAM_Buffer1+2,x
             sta $03                  
             stx $02                  
             pla                      
             tax
             lda StatusBarOffset,x    
             sec
             sbc StatusBarData+1,y    
             tay                      
             ldx $02
DigitPLoop:  lda DisplayDigits,y      
             sta VRAM_Buffer1+3,x    
             inx
             iny
             dec $03                  
             bne DigitPLoop
             lda #$00                 
             sta VRAM_Buffer1+3,x
             inx                      
             inx
             inx
             stx VRAM_Buffer1_Offset  
ExitOutputN: rts



DigitsMathRoutine:
            lda OperMode              
            cmp #TitleScreenModeValue
            beq EraseDMods            
            ldx #$05
AddModLoop: lda DigitModifier,x       
            clc
            adc DisplayDigits,y       
            bmi BorrowOne             
            cmp #10
            bcs CarryOne              
StoreNewD:  sta DisplayDigits,y       
            dey                       
            dex                       
            bpl AddModLoop            
EraseDMods: lda #$00                  
            ldx #$06                  
EraseMLoop: sta DigitModifier-1,x     
            dex
            bpl EraseMLoop            
            rts
BorrowOne:  dec DigitModifier-1,x     
            lda #$09                  
            bne StoreNewD             
CarryOne:   sec                       
            sbc #10                   
            inc DigitModifier-1,x     
            jmp StoreNewD             



UpdateTopScore:
      ldx #$05          
      jsr TopScoreCheck
      ldx #$0b          

TopScoreCheck:
              ldy #$05                 
              sec           
GetScoreDiff: lda PlayerScoreDisplay,x 
              sbc TopScoreDisplay,y    
              dex                      
              dey                      
              bpl GetScoreDiff      
              bcc NoTopSc              
              inx                      
              iny
CopyScore:    lda PlayerScoreDisplay,x 
              sta TopScoreDisplay,y
              inx
              iny
              cpy #$06                 
              bcc CopyScore
NoTopSc:      rts

 


InitializeGame:
             ldy #$6f              
             jsr InitializeMemory  
             ldy #$1f
ClrSndLoop:  sta SoundMemory,y     
             dey                   
             bpl ClrSndLoop
             lda #$18              
             sta DemoTimer
             jsr LoadAreaPointer

InitializeArea:
               ldy #$4b                 
               jsr InitializeMemory     
               ldx #$21
               lda #$00
ClrTimersLoop: sta Timers,x             
               dex                      
               bpl ClrTimersLoop
               lda HalfwayPage
               ldy AltEntranceControl   
               beq StartPage
               lda EntrancePage         
StartPage:     sta ScreenLeft_PageLoc   
               sta CurrentPageLoc       
               sta BackloadingFlag      
               jsr GetScreenPosition    
               ldy #$20                 
               and #%00000001           
               beq SetInitNTHigh        
               ldy #$24
SetInitNTHigh: sty CurrentNTAddr_High   
               ldy #$80
               sty CurrentNTAddr_Low
               asl                      
               asl                      
               asl
               asl
               sta BlockBufferColumnPos
               dec AreaObjectLength     
               dec AreaObjectLength+1
               dec AreaObjectLength+2
               lda #$0b                 
               sta ColumnSets           
               jsr GetAreaDataAddrs     
               lda PrimaryHardMode      
               bne SetSecHard           
               lda WorldNumber          
               cmp #World5              
               bcc CheckHalfway
               bne SetSecHard           
               lda LevelNumber          
               cmp #Level3              
               bcc CheckHalfway
SetSecHard:    inc SecondaryHardMode    
CheckHalfway:  lda HalfwayPage
               beq DoneInitArea
               lda #$02                 
               sta PlayerEntranceCtrl
DoneInitArea:  lda #Silence             
               sta AreaMusicQueue
               lda #$01                 
               sta DisableScreenFlag
               inc OperMode_Task        
               rts



PrimaryGameSetup:
      lda #$01
      sta FetchNewGameTimerFlag   
      sta PlayerSize              
      lda #$02
      sta NumberofLives           
      sta OffScr_NumberofLives

SecondaryGameSetup:
             lda #$00
             sta DisableScreenFlag     
             tay
ClearVRLoop: sta VRAM_Buffer1-1,y      
             iny
             bne ClearVRLoop
             sta GameTimerExpiredFlag  
             sta DisableIntermediate   
             sta BackloadingFlag       
             lda #$ff
             sta BalPlatformAlignment  
             lda ScreenLeft_PageLoc    
             lsr Mirror_PPU_CTRL_REG1  
             and #$01                  
             ror                       
             rol Mirror_PPU_CTRL_REG1  
             jsr GetAreaMusic          
             lda #$38                  
             sta SprShuffleAmt+2
             lda #$48
             sta SprShuffleAmt+1
             lda #$58
             sta SprShuffleAmt
             ldx #$0e                  
ShufAmtLoop: lda DefaultSprOffsets,x
             sta SprDataOffset,x
             dex                       
             bpl ShufAmtLoop
             ldy #$03                  
ISpr0Loop:   lda Sprite0Data,y
             sta Sprite_Data,y
             dey
             bpl ISpr0Loop
             jsr DoNothing2            
             jsr DoNothing1
             inc Sprite0HitDetectFlag  
             inc OperMode_Task         
             rts






InitializeMemory:
              ldx #$07          
              lda #$00          
              sta $06
InitPageLoop: stx $07
InitByteLoop: cpx #$01          
              bne InitByte      
              cpy #$60          
              bcs SkipByte      
InitByte:     sta ($06),y       
SkipByte:     dey
              cpy #$ff          
              bne InitByteLoop
              dex               
              bpl InitPageLoop  
              rts

 
GetAreaMusic:
             lda OperMode           
             beq ExitGetM
             lda AltEntranceControl 
             cmp #$02               
             beq ChkAreaType        
             ldy #$05               
             lda PlayerEntranceCtrl 
             cmp #$06
             beq StoreMusic         
             cmp #$07               
             beq StoreMusic
ChkAreaType: ldy AreaType           
             lda CloudTypeOverride
             beq StoreMusic         
             ldy #$04               
StoreMusic:  lda MusicSelectData,y  
             sta AreaMusicQueue     
ExitGetM:    rts


 

Entrance_GameTimerSetup:
          lda ScreenLeft_PageLoc      
          sta Player_PageLoc          
          lda #$28                    
          sta VerticalForceDown       
          lda #$01                    
          sta PlayerFacingDir         
          sta Player_Y_HighPos
          lda #$00                    
          sta Player_State
          dec Player_CollisionBits    
          ldy #$00                    
          sty HalfwayPage      
          lda AreaType                
          bne ChkStPos                
          iny
ChkStPos: sty SwimmingFlag
          ldx PlayerEntranceCtrl      
          ldy AltEntranceControl      
          beq SetStPos
          cpy #$01
          beq SetStPos
          ldx AltYPosOffset-2,y       
SetStPos: lda PlayerStarting_X_Pos,y  
          sta Player_X_Position       
          lda PlayerStarting_Y_Pos,x  
          sta Player_Y_Position       
          lda PlayerBGPriorityData,x
          sta Player_SprAttrib        
          jsr GetPlayerColors         
          ldy GameTimerSetting        
          beq ChkOverR                
          lda FetchNewGameTimerFlag   
          beq ChkOverR                
          lda GameTimerData,y         
          sta GameTimerDisplay        
          lda #$01
          sta GameTimerDisplay+2      
          lsr
          sta GameTimerDisplay+1      
          sta FetchNewGameTimerFlag   
          sta StarInvincibleTimer     
ChkOverR: ldy JoypadOverride          
          beq ChkSwimE
          lda #$03                    
          sta Player_State
          ldx #$00                    
          jsr InitBlock_XY_Pos
          lda #$f0                    
          sta Block_Y_Position
          ldx #$05                    
          ldy #$00                    
          jsr Setup_Vine              
ChkSwimE: ldy AreaType                
          bne SetPESub                
          jsr SetupBubble             
SetPESub: lda #$07                    
          sta GameEngineSubroutine    
          rts
 

PlayerLoseLife:
             inc DisableScreenFlag    
             lda #$00
             sta Sprite0HitDetectFlag
             lda #Silence             
             sta EventMusicQueue
             dec NumberofLives        
             bpl StillInGame          
             lda #$00
             sta OperMode_Task        
             lda #GameOverModeValue   
             sta OperMode             
             rts
StillInGame: lda WorldNumber          
             asl                      
             tax
             lda LevelNumber          
             and #$02                 
             beq GetHalfway           
             inx
GetHalfway:  ldy HalfwayPageNybbles,x 
             lda LevelNumber          
             lsr
             tya                      
             bcs MaskHPNyb
             lsr                      
             lsr                      
             lsr
             lsr
MaskHPNyb:   and #%00001111           
             cmp ScreenLeft_PageLoc
             beq SetHalfway           
             bcc SetHalfway           
             lda #$00                 
SetHalfway:  sta HalfwayPage          
             jsr TransposePlayers     
             jmp ContinueGame         



GameOverMode:
      lda OperMode_Task
      jsr JumpEngine
      
 



SetupGameOver:
      lda #$00                  
      sta ScreenRoutineTask     
      sta Sprite0HitDetectFlag  
      lda #GameOverMusic
      sta EventMusicQueue       
      inc DisableScreenFlag     
      inc OperMode_Task         
      rts



RunGameOver:
      lda #$00              
      sta DisableScreenFlag
      lda SavedJoypad1Bits  
      and #Start_Button
      bne TerminateGame
      lda ScreenTimer       
      bne GameIsOn          
TerminateGame:
      lda #Silence          
      sta EventMusicQueue
      jsr TransposePlayers  
      bcc ContinueGame      
      lda WorldNumber       
      sta ContinueWorld     
      lda #$00
      asl                   
      sta OperMode_Task     
      sta ScreenTimer       
      sta OperMode
      rts

ContinueGame:
           jsr LoadAreaPointer       
           lda #$01                  
           sta PlayerSize            
           inc FetchNewGameTimerFlag 
           lda #$00                  
           sta TimerControl          
           sta PlayerStatus
           sta GameEngineSubroutine  
           sta OperMode_Task         
           lda #$01                  
           sta OperMode              
GameIsOn:  rts

TransposePlayers:
           sec                       
           lda NumberOfPlayers       
           beq ExTrans
           lda OffScr_NumberofLives  
           bmi ExTrans               
           lda CurrentPlayer         
           eor #%00000001            
           sta CurrentPlayer
           ldx #$06
TransLoop: lda OnscreenPlayerInfo,x    
           pha                         
           lda OffscreenPlayerInfo,x   
           sta OnscreenPlayerInfo,x
           pla
           sta OffscreenPlayerInfo,x
           dex
           bpl TransLoop
           clc            
ExTrans:   rts



DoNothing1:
      lda #$ff       
      sta $06c9      
DoNothing2:
      rts



AreaParserTaskHandler:
              ldy AreaParserTaskNum     
              bne DoAPTasks             
              ldy #$08
              sty AreaParserTaskNum     
DoAPTasks:    dey
              tya
              jsr AreaParserTasks
              dec AreaParserTaskNum     
              bne SkipATRender          
              jsr RenderAttributeTables
SkipATRender: rts

AreaParserTasks:
      jsr JumpEngine
 



IncrementColumnPos:
           inc CurrentColumnPos     
           lda CurrentColumnPos
           and #%00001111           
           bne NoColWrap
           sta CurrentColumnPos     
           inc CurrentPageLoc       
NoColWrap: inc BlockBufferColumnPos 
           lda BlockBufferColumnPos
           and #%00011111           
           sta BlockBufferColumnPos 
           rts
  
AreaParserCore:
      lda BackloadingFlag       
      beq RenderSceneryTerrain  
      jsr ProcessAreaData       

RenderSceneryTerrain:
          ldx #$0c
          lda #$00
ClrMTBuf: sta MetatileBuffer,x       
          dex
          bpl ClrMTBuf
          ldy BackgroundScenery      
          beq RendFore               
          lda CurrentPageLoc         
ThirdP:   cmp #$03
          bmi RendBack               
          sec
          sbc #$03                   
          bpl ThirdP                 
RendBack: asl                        
          asl
          asl
          asl
          adc BSceneDataOffsets-1,y  
          adc CurrentColumnPos       
          tax
          lda BackSceneryData,x      
          beq RendFore               
          pha
          and #$0f                   
          sec
          sbc #$01                   
          sta $00                    
          asl                        
          adc $00                    
          tax                        
          pla                        
          lsr
          lsr
          lsr
          lsr
          tay                        
          lda #$03                   
          sta $00
SceLoop1: lda BackSceneryMetatiles,x 
          sta MetatileBuffer,y       
          inx
          iny
          cpy #$0b                   
          beq RendFore
          dec $00                    
          bne SceLoop1
RendFore: ldx ForegroundScenery      
          beq RendTerr               
          ldy FSceneDataOffsets-1,x  
          ldx #$00                   
SceLoop2: lda ForeSceneryData,y      
          beq NoFore                 
          sta MetatileBuffer,x
NoFore:   iny
          inx
          cpx #$0d                   
          bne SceLoop2
RendTerr: ldy AreaType               
          bne TerMTile               
          lda WorldNumber            
          cmp #World8                
          bne TerMTile
          lda #$62                   
          jmp StoreMT                
TerMTile: lda TerrainMetatiles,y     
          ldy CloudTypeOverride      
          beq StoreMT                
          lda #$88                   
StoreMT:  sta $07                    
          ldx #$00                   
          lda TerrainControl         
          asl                        
          tay
TerrLoop: lda TerrainRenderBits,y    
          sta $00
          iny                        
          sty $01
          lda CloudTypeOverride      
          beq NoCloud2
          cpx #$00                   
          beq NoCloud2
          lda $00                    
          and #%00001000
          sta $00
NoCloud2: ldy #$00                   
TerrBChk: lda Bitmasks,y             
          bit $00
          beq NextTBit               
          lda $07
          sta MetatileBuffer,x       
NextTBit: inx                        
          cpx #$0d
          beq RendBBuf               
          lda AreaType               
          cmp #$02
          bne EndUChk                
          cpx #$0b
          bne EndUChk                
          lda #$54                   
          sta $07
EndUChk:  iny                        
          cpy #$08
          bne TerrBChk               
          ldy $01
          bne TerrLoop               
RendBBuf: jsr ProcessAreaData        
          lda BlockBufferColumnPos
          jsr GetBlockBufferAddr     
          ldx #$00
          ldy #$00                   
ChkMTLow: sty $00
          lda MetatileBuffer,x       
          and #%11000000             
          asl
          rol                        
          rol
          tay                        
          lda MetatileBuffer,x       
          cmp BlockBuffLowBounds,y   
          bcs StrBlock               
          lda #$00                   
StrBlock: ldy $00                    
          sta ($06),y                
          tya
          clc                        
          adc #$10
          tay
          inx                        
          cpx #$0d
          bcc ChkMTLow               
          rts
 
ProcessAreaData:
            ldx #$02                 
ProcADLoop: stx ObjectOffset
            lda #$00                 
            sta BehindAreaParserFlag
            ldy AreaDataOffset       
            lda (AreaData),y         
            cmp #$fd                 
            beq RdyDecode
            lda AreaObjectLength,x   
            bpl RdyDecode            
            iny
            lda (AreaData),y         
            asl                      
            bcc Chk1Row13
            lda AreaObjectPageSel    
            bne Chk1Row13
            inc AreaObjectPageSel    
            inc AreaObjectPageLoc    
Chk1Row13:  dey
            lda (AreaData),y         
            and #$0f                 
            cmp #$0d                 
            bne Chk1Row14
            iny                      
            lda (AreaData),y
            dey                      
            and #%01000000           
            bne CheckRear
            lda AreaObjectPageSel    
            bne CheckRear
            iny                      
            lda (AreaData),y
            and #%00011111           
            sta AreaObjectPageLoc
            inc AreaObjectPageSel    
            jmp NextAObj
Chk1Row14:  cmp #$0e                 
            bne CheckRear
            lda BackloadingFlag      
            bne RdyDecode            
CheckRear:  lda AreaObjectPageLoc    
            cmp CurrentPageLoc       
            bcc SetBehind            
RdyDecode:  jsr DecodeAreaData       
            jmp ChkLength
SetBehind:  inc BehindAreaParserFlag 
NextAObj:   jsr IncAreaObjOffset     
ChkLength:  ldx ObjectOffset         
            lda AreaObjectLength,x   
            bmi ProcLoopb            
            dec AreaObjectLength,x   
ProcLoopb:  dex                      
            bpl ProcADLoop           
            lda BehindAreaParserFlag 
            bne ProcessAreaData      
            lda BackloadingFlag      
            bne ProcessAreaData      
EndAParse:  rts

IncAreaObjOffset:
      inc AreaDataOffset    
      inc AreaDataOffset
      lda #$00              
      sta AreaObjectPageSel
      rts

DecodeAreaData:
          lda AreaObjectLength,x     
          bmi Chk1stB
          ldy AreaObjOffsetBuffer,x  
Chk1stB:  ldx #$10                   
          lda (AreaData),y           
          cmp #$fd
          beq EndAParse              
          and #$0f                   
          cmp #$0f                   
          beq ChkRow14               
          ldx #$08                   
          cmp #$0c                   
          beq ChkRow14               
          ldx #$00                   
ChkRow14: stx $07                    
          ldx ObjectOffset           
          cmp #$0e                   
          bne ChkRow13
          lda #$00                   
          sta $07
          lda #$2e                   
          bne NormObj                
ChkRow13: cmp #$0d                   
          bne ChkSRows
          lda #$22                   
          sta $07
          iny                        
          lda (AreaData),y
          and #%01000000             
          beq LeavePar               
          lda (AreaData),y           
          and #%01111111             
          cmp #$4b                   
          bne Mask2MSB               
          inc LoopCommand            
Mask2MSB: and #%00111111             
          jmp NormObj                
ChkSRows: cmp #$0c                   
          bcs SpecObj
          iny                        
          lda (AreaData),y
          and #%01110000             
          bne LrgObj                 
          lda #$16
          sta $07                    
          lda (AreaData),y           
          and #%00001111             
          jmp NormObj
LrgObj:   sta $00                    
          cmp #$70                   
          bne NotWPipe
          lda (AreaData),y           
          and #%00001000             
          beq NotWPipe               
          lda #$00                   
          sta $00
NotWPipe: lda $00                    
          jmp MoveAOId
SpecObj:  iny                        
          lda (AreaData),y
          and #%01110000             
MoveAOId: lsr                        
          lsr
          lsr
          lsr
NormObj:  sta $00                    
          lda AreaObjectLength,x     
          bpl RunAObj                
          lda AreaObjectPageLoc      
          cmp CurrentPageLoc         
          beq InitRear
          ldy AreaDataOffset         
          lda (AreaData),y           
          and #%00001111
          cmp #$0e                   
          bne LeavePar
          lda BackloadingFlag        
          bne StrAObj                
LeavePar: rts
InitRear: lda BackloadingFlag        
          beq BackColC               
          lda #$00                   
          sta BackloadingFlag        
          sta BehindAreaParserFlag
          sta ObjectOffset
LoopCmdE: rts
BackColC: ldy AreaDataOffset         
          lda (AreaData),y
          and #%11110000             
          lsr
          lsr
          lsr
          lsr
          cmp CurrentColumnPos       
          bne LeavePar               
StrAObj:  lda AreaDataOffset         
          sta AreaObjOffsetBuffer,x
          jsr IncAreaObjOffset       
RunAObj:  lda $00                    
          clc                        
          adc $07
          jsr JumpEngine







AlterAreaAttributes:
         ldy AreaObjOffsetBuffer,x 
         iny                       
         lda (AreaData),y
         pha                       
         and #%01000000
         bne Alter2                
         pla
         pha                       
         and #%00001111            
         sta TerrainControl        
         pla
         and #%00110000            
         lsr                       
         lsr                       
         lsr
         lsr
         sta BackgroundScenery     
         rts
Alter2:  pla
         and #%00000111            
         cmp #$04                  
         bcc SetFore               
         sta BackgroundColorCtrl
         lda #$00
SetFore: sta ForegroundScenery     
         rts



ScrollLockObject_Warp:
         ldx #$04            
         lda WorldNumber     
         beq WarpNum
         inx                 
         ldy AreaType        
         dey
         bne WarpNum         
         inx                 
WarpNum: txa
         sta WarpZoneControl 
         jsr WriteGameText   
         lda #PiranhaPlant
         jsr KillEnemies     

ScrollLockObject:
      lda ScrollLock      
      eor #%00000001
      sta ScrollLock
      rts




KillEnemies:
           sta $00           
           lda #$00
           ldx #$04          
KillELoop: ldy Enemy_ID,x
           cpy $00           
           bne NoKillE
           sta Enemy_Flag,x  
NoKillE:   dex               
           bpl KillELoop
           rts



FrenzyIDData:
 
AreaFrenzy:  ldx $00               
             lda FrenzyIDData-8,x  
             ldy #$05
FreCompLoop: dey                   
             bmi ExitAFrenzy       
             cmp Enemy_ID,y    
             bne FreCompLoop
             lda #$00              
ExitAFrenzy: sta EnemyFrenzyQueue  
             rts




AreaStyleObject:
      lda AreaStyle        
      jsr JumpEngine 

TreeLedge:
          jsr GetLrgObjAttrib     
          lda AreaObjectLength,x  
          beq EndTreeL   
          bpl MidTreeL
          tya
          sta AreaObjectLength,x  
          lda CurrentPageLoc
          ora CurrentColumnPos    
          beq MidTreeL
          lda #$16                
          jmp NoUnder
MidTreeL: ldx $07
          lda #$17                
          sta MetatileBuffer,x    
          lda #$4c                
          jmp AllUnder            
EndTreeL: lda #$18                
          jmp NoUnder

MushroomLedge:
          jsr ChkLrgObjLength        
          sty $06                    
          bcc EndMushL
          lda AreaObjectLength,x     
          lsr
          sta MushroomLedgeHalfLen,x
          lda #$19                   
          jmp NoUnder
EndMushL: lda #$1b                   
          ldy AreaObjectLength,x
          beq NoUnder
          lda MushroomLedgeHalfLen,x 
          sta $06                    
          ldx $07
          lda #$1a
          sta MetatileBuffer,x       
          cpy $06                    
          bne MushLExit              
          inx
          lda #$4f
          sta MetatileBuffer,x       
          lda #$50
AllUnder: inx
          ldy #$0f                   
          jmp RenderUnderPart       
NoUnder:  ldx $07                    
          ldy #$00                   
          jmp RenderUnderPart

PulleyRopeObject:
           jsr ChkLrgObjLength       
           ldy #$00                  
           bcs RenderPul             
           iny
           lda AreaObjectLength,x    
           bne RenderPul
           iny                       
RenderPul: lda PulleyRopeMetatiles,y
           sta MetatileBuffer        
MushLExit: rts                       



CastleObject:
            jsr GetLrgObjAttrib      
            sty $07                  
            ldy #$04
            jsr ChkLrgObjFixedLength 
            txa                  
            pha                      
            ldy AreaObjectLength,x   
            ldx $07                  
            lda #$0b
            sta $06                  
CRendLoop:  lda CastleMetatiles,y    
            sta MetatileBuffer,x
            inx                      
            lda $06
            beq ChkCFloor            
            iny                      
            iny                      
            iny
            iny
            iny
            dec $06                  
ChkCFloor:  cpx #$0b                 
            bne CRendLoop            
            pla
            tax                      
            lda CurrentPageLoc
            beq ExitCastle           
            lda AreaObjectLength,x   
            cmp #$01                 
            beq PlayerStop
            ldy $07                  
            bne NotTall
            cmp #$03                 
            beq PlayerStop
NotTall:    cmp #$02                 
            bne ExitCastle           
            jsr GetAreaObjXPosition  
            pha
            jsr FindEmptyEnemySlot   
            pla
            sta Enemy_X_Position,x   
            lda CurrentPageLoc
            sta Enemy_PageLoc,x      
            lda #$01
            sta Enemy_Y_HighPos,x    
            sta Enemy_Flag,x         
            lda #$90
            sta Enemy_Y_Position,x   
            lda #StarFlagObject      
            sta Enemy_ID,x
            rts
PlayerStop: ldy #$52                 
            sty MetatileBuffer+10    
ExitCastle: rts



WaterPipe:
      jsr GetLrgObjAttrib     
      ldy AreaObjectLength,x  
      ldx $07                 
      lda #$6b
      sta MetatileBuffer,x    
      lda #$6c
      sta MetatileBuffer+1,x
      rts






IntroPipe:
               ldy #$03                 
               jsr ChkLrgObjFixedLength
               ldy #$0a                 
               jsr RenderSidewaysPipe
               bcs NoBlankP             
               ldx #$06                 
VPipeSectLoop: lda #$00                 
               sta MetatileBuffer,x     
               dex
               bpl VPipeSectLoop
               lda VerticalPipeData,y   
               sta MetatileBuffer+7
NoBlankP:      rts


ExitPipe:
      ldy #$03                 
      jsr ChkLrgObjFixedLength
      jsr GetLrgObjAttrib      

RenderSidewaysPipe:
              dey                       
              dey                       
              sty $05
              ldy AreaObjectLength,x    
              sty $06
              ldx $05                   
              inx
              lda SidePipeShaftData,y   
              cmp #$00
              beq DrawSidePart          
              ldx #$00
              ldy $05                   
              jsr RenderUnderPart       
              clc                       
DrawSidePart: ldy $06                   
              lda SidePipeTopPart,y
              sta MetatileBuffer,x      
              lda SidePipeBottomPart,y  
              sta MetatileBuffer+1,x
              rts

 
VerticalPipe:
          jsr GetPipeHeight
          lda $00                  
          beq WarpPipe             
          iny
          iny
          iny
          iny                      
WarpPipe: tya                      
          pha
          lda AreaNumber
          ora WorldNumber          
          beq DrawPipe
          ldy AreaObjectLength,x   
          beq DrawPipe             
          jsr FindEmptyEnemySlot   
          bcs DrawPipe             
          jsr GetAreaObjXPosition  
          clc
          adc #$08                 
          sta Enemy_X_Position,x   
          lda CurrentPageLoc       
          adc #$00
          sta Enemy_PageLoc,x      
          lda #$01
          sta Enemy_Y_HighPos,x
          sta Enemy_Flag,x         
          jsr GetAreaObjYPosition  
          sta Enemy_Y_Position,x
          lda #PiranhaPlant        
          sta Enemy_ID,x
          jsr InitPiranhaPlant
DrawPipe: pla                      
          tay
          ldx $07                  
          lda VerticalPipeData,y   
          sta MetatileBuffer,x     
          inx
          lda VerticalPipeData+2,y 
          ldy $06                  
          dey
          jmp RenderUnderPart
      
GetPipeHeight:
      ldy #$01       
      jsr ChkLrgObjFixedLength 
      jsr GetLrgObjAttrib
      tya            
      and #$07       
      sta $06        
      ldy AreaObjectLength,x    
      rts

FindEmptyEnemySlot:
              ldx #$00          
EmptyChkLoop: clc               
              lda Enemy_Flag,x  
              beq ExitEmptyChk  
              inx
              cpx #$05          
              bne EmptyChkLoop
ExitEmptyChk: rts               



Hole_Water:
      jsr ChkLrgObjLength   
      lda #$86              
      sta MetatileBuffer+10
      ldx #$0b
      ldy #$01              
      lda #$87
      jmp RenderUnderPart



QuestionBlockRow_High:
      lda #$03    

QuestionBlockRow_Low:
      lda #$07             
      pha                  
      jsr ChkLrgObjLength  
      pla
      tax                  
      lda #$c0
      sta MetatileBuffer,x
      rts



Bridge_High:
      lda #$06  

Bridge_Middle:
      lda #$07  

Bridge_Low:
      lda #$09             
      pha                  
      jsr ChkLrgObjLength  
      pla
      tax                  
      lda #$0b
      sta MetatileBuffer,x
      inx
      ldy #$00             
      lda #$63
      jmp RenderUnderPart



FlagBalls_Residual:
      jsr GetLrgObjAttrib  
      ldx #$02             
      lda #$6d             
      jmp RenderUnderPart



FlagpoleObject:
      lda #$24                 
      sta MetatileBuffer
      ldx #$01                 
      ldy #$08
      lda #$25
      jsr RenderUnderPart
      lda #$61                 
      sta MetatileBuffer+10
      jsr GetAreaObjXPosition
      sec                      
      sbc #$08                 
      sta Enemy_X_Position+5   
      lda CurrentPageLoc
      sbc #$00                 
      sta Enemy_PageLoc+5      
      lda #$30
      sta Enemy_Y_Position+5   
      lda #$b0
      sta FlagpoleFNum_Y_Pos   
      lda #FlagpoleFlagObject
      sta Enemy_ID+5           
      inc Enemy_Flag+5         
      rts



EndlessRope:
      ldx #$00       
      ldy #$0f
      jmp DrawRope

BalancePlatRope:
          txa                 
          pha
          ldx #$01            
          ldy #$0f            
          lda #$44
          jsr RenderUnderPart
          pla                 
          tax
          jsr GetLrgObjAttrib 
          ldx #$01
DrawRope: lda #$40            
          jmp RenderUnderPart



RowOfCoins:
      ldy AreaType            
      lda CoinMetatileData,y  
      jmp GetRow

 
CastleBridgeObj:
      ldy #$0c                  
      jsr ChkLrgObjFixedLength
      jmp ChainObj

AxeObj:
      lda #$08                  
      sta VRAM_Buffer_AddrCtrl

ChainObj:
      ldy $00                   
      ldx C_ObjectRow-2,y       
      lda C_ObjectMetatile-2,y
      jmp ColObj

EmptyBlock:
        jsr GetLrgObjAttrib  
        ldx $07
        lda #$c4
ColObj: ldy #$00             
        jmp RenderUnderPart

 

RowOfBricks:
            ldy AreaType           
            lda CloudTypeOverride  
            beq DrawBricks
            ldy #$04               
DrawBricks: lda BrickMetatiles,y   
            jmp GetRow             

RowOfSolidBlocks:
         ldy AreaType               
         lda SolidBlockMetatiles,y  
GetRow:  pha                        
         jsr ChkLrgObjLength        
DrawRow: ldx $07
         ldy #$00                   
         pla
         jmp RenderUnderPart        

ColumnOfBricks:
      ldy AreaType          
      lda BrickMetatiles,y  
      jmp GetRow2

ColumnOfSolidBlocks:
         ldy AreaType               
         lda SolidBlockMetatiles,y  
GetRow2: pha                        
         jsr GetLrgObjAttrib        
         pla                        
         ldx $07                    
         jmp RenderUnderPart        



BulletBillCannon:
             jsr GetLrgObjAttrib      
             ldx $07                  
             lda #$64                 
             sta MetatileBuffer,x
             inx
             dey                      
             bmi SetupCannon
             lda #$65                 
             sta MetatileBuffer,x
             inx
             dey                      
             bmi SetupCannon
             lda #$66                 
             jsr RenderUnderPart
SetupCannon: ldx Cannon_Offset        
             jsr GetAreaObjYPosition  
             sta Cannon_Y_Position,x  
             lda CurrentPageLoc
             sta Cannon_PageLoc,x     
             jsr GetAreaObjXPosition  
             sta Cannon_X_Position,x  
             inx
             cpx #$06                 
             bcc StrCOffset           
             ldx #$00                 
StrCOffset:  stx Cannon_Offset        
             rts


 
StaircaseObject:
           jsr ChkLrgObjLength       
           bcc NextStair             
           lda #$09                  
           sta StaircaseControl      
NextStair: dec StaircaseControl      
           ldy StaircaseControl
           ldx StaircaseRowData,y    
           lda StaircaseHeightData,y
           tay
           lda #$61                  
           jmp RenderUnderPart



Jumpspring:
      jsr GetLrgObjAttrib
      jsr FindEmptyEnemySlot      
      jsr GetAreaObjXPosition     
      sta Enemy_X_Position,x      
      lda CurrentPageLoc          
      sta Enemy_PageLoc,x
      jsr GetAreaObjYPosition     
      sta Enemy_Y_Position,x      
      sta Jumpspring_FixedYPos,x  
      lda #JumpspringObject
      sta Enemy_ID,x              
      ldy #$01
      sty Enemy_Y_HighPos,x       
      inc Enemy_Flag,x            
      ldx $07
      lda #$67                    
      sta MetatileBuffer,x
      lda #$68
      sta MetatileBuffer+1,x
      rts




Hidden1UpBlock:
      lda Hidden1UpFlag  
      beq ExitDecBlock
      lda #$00           
      sta Hidden1UpFlag
      jmp BrickWithItem  

QuestionBlock:
      jsr GetAreaObjectID 
      jmp DrawQBlk        

BrickWithCoins:
      lda #$00                 
      sta BrickCoinTimerFlag

BrickWithItem:
          jsr GetAreaObjectID         
          sty $07              
          lda #$00                    
          ldy AreaType                
          dey
          beq BWithL                  
          lda #$05                    
BWithL:   clc                         
          adc $07
          tay                         
DrawQBlk: lda BrickQBlockMetatiles,y  
          pha                         
          jsr GetLrgObjAttrib         
          jmp DrawRow                 

GetAreaObjectID:
              lda $00    
              sec
              sbc #$00   
              tay        
ExitDecBlock: rts


 
Hole_Empty:
            jsr ChkLrgObjLength          
            bcc NoWhirlP                 
            lda AreaType                 
            bne NoWhirlP                 
            ldx Whirlpool_Offset         
            jsr GetAreaObjXPosition      
            sec
            sbc #$10                     
            sta Whirlpool_LeftExtent,x   
            lda CurrentPageLoc           
            sbc #$00                     
            sta Whirlpool_PageLoc,x      
            iny
            iny                          
            tya
            asl                          
            asl                          
            asl                          
            asl                          
            sta Whirlpool_Length,x       
            inx
            cpx #$05                     
            bcc StrWOffset               
            ldx #$00                     
StrWOffset: stx Whirlpool_Offset         
NoWhirlP:   ldx AreaType                 
            lda HoleMetatiles,x          
            ldx #$08
            ldy #$0f                     



RenderUnderPart:
             sty AreaObjectHeight  
             ldy MetatileBuffer,x  
             beq DrawThisRow       
             cpy #$17
             beq WaitOneRow        
             cpy #$1a
             beq WaitOneRow        
             cpy #$c0
             beq DrawThisRow       
             cpy #$c0
             bcs WaitOneRow        
             cpy #$54
             bne DrawThisRow       
             cmp #$50
             beq WaitOneRow        
DrawThisRow: sta MetatileBuffer,x  
WaitOneRow:  inx
             cpx #$0d              
             bcs ExitUPartR
             ldy AreaObjectHeight  
             dey
             bpl RenderUnderPart
ExitUPartR:  rts



ChkLrgObjLength:
        jsr GetLrgObjAttrib     

ChkLrgObjFixedLength:
        lda AreaObjectLength,x  
        clc                     
        bpl LenSet              
        tya                     
        sta AreaObjectLength,x
        sec                     
LenSet: rts


GetLrgObjAttrib:
      ldy AreaObjOffsetBuffer,x 
      lda (AreaData),y          
      and #%00001111
      sta $07                   
      iny
      lda (AreaData),y          
      and #%00001111            
      tay
      rts



GetAreaObjXPosition:
      lda CurrentColumnPos    
      asl                     
      asl
      asl
      asl
      rts



GetAreaObjYPosition:
      lda $07  
      asl
      asl      
      asl
      asl
      clc
      adc #32  
      rts



 
GetBlockBufferAddr:
      pha                      
      lsr                      
      lsr
      lsr
      lsr
      tay                      
      lda BlockBufferAddr+2,y  
      sta $07
      pla
      and #%00001111           
      clc
      adc BlockBufferAddr,y    
      sta $06                  
      rts

 

LoadAreaPointer:
             jsr FindAreaPointer  
             sta AreaPointer
GetAreaType: and #%01100000       
             asl
             rol
             rol
             rol                  
             sta AreaType         
             rts

FindAreaPointer:
      ldy WorldNumber        
      lda WorldAddrOffsets,y
      clc                    
      adc AreaNumber
      tay
      lda AreaAddrOffsets,y  
      rts


GetAreaDataAddrs:
            lda AreaPointer          
            jsr GetAreaType
            tay
            lda AreaPointer          
            and #%00011111
            sta AreaAddrsLOffset     
            lda EnemyAddrHOffsets,y  
            clc                      
            adc AreaAddrsLOffset     
            tay
            lda EnemyDataAddrLow,y   
            sta EnemyDataLow
            lda EnemyDataAddrHigh,y
            sta EnemyDataHigh
            ldy AreaType             
            lda AreaDataHOffsets,y   
            clc
            adc AreaAddrsLOffset        
            tay
            lda AreaDataAddrLow,y    
            sta AreaDataLow
            lda AreaDataAddrHigh,y
            sta AreaDataHigh
            ldy #$00                 
            lda (AreaData),y     
            pha                      
            and #%00000111           
            cmp #$04
            bcc StoreFore
            sta BackgroundColorCtrl  
            lda #$00
StoreFore:  sta ForegroundScenery    
            pla                      
            pha
            and #%00111000           
            lsr                      
            lsr
            lsr
            sta PlayerEntranceCtrl       
            pla                      
            and #%11000000           
            clc
            rol                      
            rol
            rol
            sta GameTimerSetting     
            iny
            lda (AreaData),y         
            pha                      
            and #%00001111           
            sta TerrainControl
            pla                      
            pha
            and #%00110000           
            lsr
            lsr                      
            lsr
            lsr
            sta BackgroundScenery    
            pla           
            and #%11000000
            clc
            rol                      
            rol
            rol
            cmp #%00000011           
            bne StoreStyle           
            sta CloudTypeOverride    
            lda #$00
StoreStyle: sta AreaStyle
            lda AreaDataLow          
            clc
            adc #$02
            sta AreaDataLow
            lda AreaDataHigh
            adc #$00
            sta AreaDataHigh
            rts

 

 
  




GameMode:
      lda OperMode_Task
      jsr JumpEngine 



GameCoreRoutine:
      ldx CurrentPlayer          
      lda SavedJoypadBits,x      
      sta SavedJoypadBits        
      jsr GameRoutines           
      lda OperMode_Task          
      cmp #$03                   
      bcs GameEngine             
      rts

GameEngine:
              jsr ProcFireball_Bubble    
              ldx #$00
ProcELoop:    stx ObjectOffset           
              jsr EnemiesAndLoopsCore    
              jsr FloateyNumbersRoutine  
              inx
              cpx #$06                   
              bne ProcELoop
              jsr GetPlayerOffscreenBits 
              jsr RelativePlayerPosition 
              jsr PlayerGfxHandler       
              jsr BlockObjMT_Updater     
              ldx #$01
              stx ObjectOffset           
              jsr BlockObjectsCore       
              dex
              stx ObjectOffset           
              jsr BlockObjectsCore       
              jsr MiscObjectsCore        
              jsr ProcessCannons         
              jsr ProcessWhirlpools      
              jsr FlagpoleRoutine        
              jsr RunGameTimer           
              jsr ColorRotation          
              lda Player_Y_HighPos
              cmp #$02                   
              bpl NoChgMus
              lda StarInvincibleTimer    
              beq ClrPlrPal              
              cmp #$04
              bne NoChgMus               
              lda IntervalTimerControl   
              bne NoChgMus               
              jsr GetAreaMusic           
NoChgMus:     ldy StarInvincibleTimer    
              lda FrameCounter           
              cpy #$08                   
              bcs CycleTwo               
              lsr                        
              lsr
CycleTwo:     lsr                        
              jsr CyclePlayerPalette     
              jmp SaveAB                 
ClrPlrPal:    jsr ResetPalStar           
SaveAB:       lda A_B_Buttons            
              sta PreviousA_B_Buttons    
              lda #$00
              sta Left_Right_Buttons     
UpdScrollVar: lda VRAM_Buffer_AddrCtrl
              cmp #$06                   
              beq ExitEng                
              lda AreaParserTaskNum      
              bne RunParser
              lda ScrollThirtyTwo        
              cmp #$20                   
              bmi ExitEng                
              lda ScrollThirtyTwo
              sbc #$20                   
              sta ScrollThirtyTwo        
              lda #$00                   
              sta VRAM_Buffer2_Offset    
RunParser:    jsr AreaParserTaskHandler  
ExitEng:      rts                        



ScrollHandler:
            lda Player_X_Scroll       
            clc
            adc Platform_X_Scroll     
            sta Player_X_Scroll       
            lda ScrollLock            
            bne InitScrlAmt           
            lda Player_Pos_ForScroll
            cmp #$50                  
            bcc InitScrlAmt           
            lda SideCollisionTimer    
            bne InitScrlAmt           
            ldy Player_X_Scroll       
            dey                       
            bmi InitScrlAmt           
            iny
            cpy #$02                  
            bcc ChkNearMid
            dey                       
ChkNearMid: lda Player_Pos_ForScroll
            cmp #$70                  
            bcc ScrollScreen          
            ldy Player_X_Scroll       

ScrollScreen:
              tya
              sta ScrollAmount          
              clc
              adc ScrollThirtyTwo       
              sta ScrollThirtyTwo       
              tya
              clc
              adc ScreenLeft_X_Pos      
              sta ScreenLeft_X_Pos      
              sta HorizontalScroll      
              lda ScreenLeft_PageLoc
              adc #$00                  
              sta ScreenLeft_PageLoc    
              and #$01                  
              sta $00                   
              lda Mirror_PPU_CTRL_REG1  
              and #%11111110            
              ora $00                   
              sta Mirror_PPU_CTRL_REG1  
              jsr GetScreenPosition     
              lda #$08
              sta ScrollIntervalTimer   
              jmp ChkPOffscr            
InitScrlAmt:  lda #$00
              sta ScrollAmount          
ChkPOffscr:   ldx #$00                  
              jsr GetXOffscreenBits     
              sta $00                   
              ldy #$00                  
              asl                       
              bcs KeepOnscr             
              iny                         
              lda $00
              and #%00100000              
              beq InitPlatScrl            
KeepOnscr:    lda ScreenEdge_X_Pos,y      
              sec
              sbc X_SubtracterData,y      
              sta Player_X_Position       
              lda ScreenEdge_PageLoc,y    
              sbc #$00                    
              sta Player_PageLoc          
              lda Left_Right_Buttons      
              cmp OffscrJoypadBitsData,y  
              beq InitPlatScrl            
              lda #$00
              sta Player_X_Speed          
InitPlatScrl: lda #$00                    
              sta Platform_X_Scroll
              rts

 


GetScreenPosition:
      lda ScreenLeft_X_Pos    
      clc
      adc #$ff                
      sta ScreenRight_X_Pos   
      lda ScreenLeft_PageLoc  
      adc #$00                
      sta ScreenRight_PageLoc 
      rts



GameRoutines:
      lda GameEngineSubroutine  
      jsr JumpEngine            
 


PlayerEntrance:
            lda AltEntranceControl    
            cmp #$02
            beq EntrMode2             
            lda #$00       
            ldy Player_Y_Position     
            cpy #$30                  
            bcc AutoControlPlayer     
            lda PlayerEntranceCtrl    
            cmp #$06
            beq ChkBehPipe            
            cmp #$07                  
            bne PlayerRdy
ChkBehPipe: lda Player_SprAttrib      
            bne IntroEntr             
            lda #$01
            jmp AutoControlPlayer     
IntroEntr:  jsr EnterSidePipe         
            dec ChangeAreaTimer       
            bne ExitEntr              
            inc DisableIntermediate   
            jmp NextArea              
EntrMode2:  lda JoypadOverride        
            bne VineEntr              
            lda #$ff                  
            jsr MovePlayerYAxis       
            lda Player_Y_Position     
            cmp #$91                  
            bcc PlayerRdy             
            rts                       
VineEntr:   lda VineHeight
            cmp #$60                  
            bne ExitEntr              
            lda Player_Y_Position     
            cmp #$99                  
            ldy #$00                  
            lda #$01                  
            bcc OffVine               
            lda #$03
            sta Player_State          
            iny                       
            lda #$08                  
            sta Block_Buffer_1+$b4    
OffVine:    sty DisableCollisionDet   
            jsr AutoControlPlayer     
            lda Player_X_Position
            cmp #$48                  
            bcc ExitEntr              
PlayerRdy:  lda #$08                  
            sta GameEngineSubroutine
            lda #$01                  
            sta PlayerFacingDir
            lsr                       
            sta AltEntranceControl    
            sta DisableCollisionDet   
            sta JoypadOverride        
ExitEntr:   rts                       




AutoControlPlayer:
      sta SavedJoypadBits         

PlayerCtrlRoutine:
            lda GameEngineSubroutine    
            cmp #$0b                    
            beq SizeChk
            lda AreaType                
            bne SaveJoyp                
            ldy Player_Y_HighPos
            dey                         
            bne DisJoyp                 
            lda Player_Y_Position
            cmp #$d0                    
            bcc SaveJoyp                
DisJoyp:    lda #$00                    
            sta SavedJoypadBits
SaveJoyp:   lda SavedJoypadBits         
            and #%11000000
            sta A_B_Buttons
            lda SavedJoypadBits         
            and #%00000011
            sta Left_Right_Buttons
            lda SavedJoypadBits         
            and #%00001100
            sta Up_Down_Buttons
            and #%00000100              
            beq SizeChk                 
            lda Player_State            
            bne SizeChk                 
            ldy Left_Right_Buttons      
            beq SizeChk                 
            lda #$00
            sta Left_Right_Buttons      
            sta Up_Down_Buttons         
SizeChk:    jsr PlayerMovementSubs      
            ldy #$01                    
            lda PlayerSize
            bne ChkMoveDir
            ldy #$00                    
            lda CrouchingFlag
            beq ChkMoveDir              
            ldy #$02                    
ChkMoveDir: sty Player_BoundBoxCtrl     
            lda #$01                    
            ldy Player_X_Speed          
            beq PlayerSubs              
            bpl SetMoveDir              
            asl                         
SetMoveDir: sta Player_MovingDir        
PlayerSubs: jsr ScrollHandler           
            jsr GetPlayerOffscreenBits  
            jsr RelativePlayerPosition  
            ldx #$00                    
            jsr BoundingBoxCore         
            jsr PlayerBGCollision       
            lda Player_Y_Position
            cmp #$40                    
            bcc PlayerHole              
            lda GameEngineSubroutine
            cmp #$05                    
            beq PlayerHole
            cmp #$07                    
            beq PlayerHole
            cmp #$04                    
            bcc PlayerHole
            lda Player_SprAttrib
            and #%11011111              
            sta Player_SprAttrib        
PlayerHole: lda Player_Y_HighPos        
            cmp #$02                    
            bmi ExitCtrl                
            ldx #$01
            stx ScrollLock              
            ldy #$04
            sty $07                     
            ldx #$00                    
            ldy GameTimerExpiredFlag    
            bne HoleDie                 
            ldy CloudTypeOverride       
            bne ChkHoleX                
HoleDie:    inx                         
            ldy GameEngineSubroutine
            cpy #$0b                    
            beq ChkHoleX                
            ldy DeathMusicLoaded        
            bne HoleBottom              
            iny
            sty EventMusicQueue         
            sty DeathMusicLoaded        
HoleBottom: ldy #$06
            sty $07                     
ChkHoleX:   cmp $07                     
            bmi ExitCtrl                
            dex                         
            bmi CloudExit               
            ldy EventMusicBuffer        
            bne ExitCtrl                
            lda #$06                    
            sta GameEngineSubroutine    
ExitCtrl:   rts                         

CloudExit:
      lda #$00
      sta JoypadOverride      
      jsr SetEntr             
      inc AltEntranceControl  
      rts



Vine_AutoClimb:
           lda Player_Y_HighPos   
           bne AutoClimb          
           lda Player_Y_Position
           cmp #$e4
           bcc SetEntr
AutoClimb: lda #%00001000         
           sta JoypadOverride
           ldy #$03               
           sty Player_State
           jmp AutoControlPlayer
SetEntr:   lda #$02               
           sta AltEntranceControl
           jmp ChgAreaMode        



VerticalPipeEntry:
      lda #$01             
      jsr MovePlayerYAxis  
      jsr ScrollHandler    
      ldy #$00             
      lda WarpZoneControl  
      bne ChgAreaPipe      
      iny
      lda AreaType         
      cmp #$03
      bne ChgAreaPipe      
      iny
      jmp ChgAreaPipe      

MovePlayerYAxis:
      clc
      adc Player_Y_Position 
      sta Player_Y_Position
      rts



SideExitPipeEntry:
             jsr EnterSidePipe         
             ldy #$02
ChgAreaPipe: dec ChangeAreaTimer       
             bne ExitCAPipe
             sty AltEntranceControl    
ChgAreaMode: inc DisableScreenFlag     
             lda #$00
             sta OperMode_Task         
             sta Sprite0HitDetectFlag  
ExitCAPipe:  rts                       

EnterSidePipe:
           lda #$08               
           sta Player_X_Speed
           ldy #$01               
           lda Player_X_Position  
           and #%00001111         
           bne RightPipe
           sta Player_X_Speed     
           tay                    
RightPipe: tya                    
           jsr AutoControlPlayer  
           rts



PlayerChangeSize:
             lda TimerControl    
             cmp #$f8            
             bne EndChgSize      
             jmp InitChangeSize  
EndChgSize:  cmp #$c4            
             bne ExitChgSize     
             jsr DonePlayerTask  
ExitChgSize: rts                 



PlayerInjuryBlink:
           lda TimerControl       
           cmp #$f0               
           bcs ExitBlink          
           cmp #$c8               
           beq DonePlayerTask     
           jmp PlayerCtrlRoutine  
ExitBlink: bne ExitBoth           

InitChangeSize:
          ldy PlayerChangeSizeFlag  
          bne ExitBoth              
          sty PlayerAnimCtrl        
          inc PlayerChangeSizeFlag  
          lda PlayerSize
          eor #$01                  
          sta PlayerSize
ExitBoth: rts                       




PlayerDeath:
      lda TimerControl       
      cmp #$f0               
      bcs ExitDeath          
      jmp PlayerCtrlRoutine  

DonePlayerTask:
      lda #$00
      sta TimerControl          
      lda #$08
      sta GameEngineSubroutine  
      rts                       

PlayerFireFlower: 
      lda TimerControl       
      cmp #$c0               
      beq ResetPalFireFlower 
      lda FrameCounter       
      lsr
      lsr                    

CyclePlayerPalette:
      and #$03              
      sta $00               
      lda Player_SprAttrib  
      and #%11111100        
      ora $00               
      sta Player_SprAttrib  
      rts                   

ResetPalFireFlower:
      jsr DonePlayerTask    

ResetPalStar:
      lda Player_SprAttrib  
      and #%11111100        
      sta Player_SprAttrib  
      rts                   

ExitDeath:
      rts          



FlagpoleSlide:
             lda Enemy_ID+5           
             cmp #FlagpoleFlagObject  
             bne NoFPObj              
             lda FlagpoleSoundQueue   
             sta Square1SoundQueue    
             lda #$00
             sta FlagpoleSoundQueue   
             ldy Player_Y_Position
             cpy #$9e                 
             bcs SlidePlayer          
             lda #$04                 
SlidePlayer: jmp AutoControlPlayer    
NoFPObj:     inc GameEngineSubroutine 
             rts                      


 

PlayerEndLevel:
          lda #$01                  
          jsr AutoControlPlayer
          lda Player_Y_Position     
          cmp #$ae
          bcc ChkStop               
          lda ScrollLock            
          beq ChkStop               
          lda #EndOfLevelMusic
          sta EventMusicQueue       
          lda #$00
          sta ScrollLock            
ChkStop:  lda Player_CollisionBits  
          lsr                       
          bcs RdyNextA              
          lda StarFlagTaskControl   
          bne InCastle              
          inc StarFlagTaskControl   
InCastle: lda #%00100000            
          sta Player_SprAttrib      
RdyNextA: lda StarFlagTaskControl
          cmp #$05                  
          bne ExitNA                
          inc LevelNumber           
          lda LevelNumber
          cmp #$03                  
          bne NextArea              
          ldy WorldNumber           
          lda CoinTallyFor1Ups      
          cmp Hidden1UpCoinAmts,y   
          bcc NextArea              
          inc Hidden1UpFlag         
NextArea: inc AreaNumber            
          jsr LoadAreaPointer       
          inc FetchNewGameTimerFlag 
          jsr ChgAreaMode           
          sta HalfwayPage           
          lda #Silence
          sta EventMusicQueue       
ExitNA:   rts



PlayerMovementSubs:
           lda #$00                  
           ldy PlayerSize            
           bne SetCrouch             
           lda Player_State          
           bne ProcMove              
           lda Up_Down_Buttons       
           and #%00000100            
SetCrouch: sta CrouchingFlag         
ProcMove:  jsr PlayerPhysicsSub      
           lda PlayerChangeSizeFlag  
           bne NoMoveSub             
           lda Player_State
           cmp #$03                  
           beq MoveSubs              
           ldy #$18
           sty ClimbSideTimer        
MoveSubs:  jsr JumpEngine
 

NoMoveSub: rts




OnGroundStateSub:
         jsr GetPlayerAnimSpeed     
         lda Left_Right_Buttons
         beq GndMove                
         sta PlayerFacingDir        
GndMove: jsr ImposeFriction         
         jsr MovePlayerHorizontally 
         sta Player_X_Scroll        
         rts



FallingSub:
      lda VerticalForceDown
      sta VerticalForce      
      jmp LRAir              



JumpSwimSub:
          ldy Player_Y_Speed         
          bpl DumpFall               
          lda A_B_Buttons
          and #A_Button              
          and PreviousA_B_Buttons    
          bne ProcSwim               
          lda JumpOrigin_Y_Position  
          sec
          sbc Player_Y_Position      
          cmp DiffToHaltJump         
          bcc ProcSwim               
DumpFall: lda VerticalForceDown      
          sta VerticalForce
ProcSwim: lda SwimmingFlag           
          beq LRAir                  
          jsr GetPlayerAnimSpeed     
          lda Player_Y_Position
          cmp #$14                   
          bcs LRWater                
          lda #$18
          sta VerticalForce          
LRWater:  lda Left_Right_Buttons     
          beq LRAir                  
          sta PlayerFacingDir        
LRAir:    lda Left_Right_Buttons     
          beq JSMove                 
          jsr ImposeFriction         
JSMove:   jsr MovePlayerHorizontally 
          sta Player_X_Scroll        
          lda GameEngineSubroutine
          cmp #$0b                   
          bne ExitMov1               
          lda #$28
          sta VerticalForce          
ExitMov1: jmp MovePlayerVertically   



 
ClimbingSub:
             lda Player_YMF_Dummy
             clc                      
             adc Player_Y_MoveForce   
             sta Player_YMF_Dummy
             ldy #$00                 
             lda Player_Y_Speed       
             bpl MoveOnVine           
             dey                      
MoveOnVine:  sty $00                  
             adc Player_Y_Position    
             sta Player_Y_Position    
             lda Player_Y_HighPos
             adc $00                  
             sta Player_Y_HighPos     
             lda Left_Right_Buttons   
             and Player_CollisionBits 
             beq InitCSTimer          
             ldy ClimbSideTimer       
             bne ExitCSub             
             ldy #$18
             sty ClimbSideTimer       
             ldx #$00                 
             ldy PlayerFacingDir      
             lsr                      
             bcs ClimbFD              
             inx
             inx                      
ClimbFD:     dey                      
             beq CSetFDir             
             inx                      
CSetFDir:    lda Player_X_Position
             clc                      
             adc ClimbAdderLow,x      
             sta Player_X_Position
             lda Player_PageLoc       
             adc ClimbAdderHigh,x     
             sta Player_PageLoc
             lda Left_Right_Buttons   
             eor #%00000011           
             sta PlayerFacingDir      
ExitCSub:    rts                      
InitCSTimer: sta ClimbSideTimer       
             rts


 

PlayerPhysicsSub:
           lda Player_State          
           cmp #$03
           bne CheckForJumping       
           ldy #$00
           lda Up_Down_Buttons       
           and Player_CollisionBits  
           beq ProcClimb             
           iny
           and #%00001000            
           bne ProcClimb
           iny
ProcClimb: ldx Climb_Y_MForceData,y  
           stx Player_Y_MoveForce    
           lda #$08                  
           ldx Climb_Y_SpeedData,y   
           stx Player_Y_Speed        
           bmi SetCAnim              
           lsr                       
SetCAnim:  sta PlayerAnimTimerSet    
           rts

CheckForJumping:
        lda JumpspringAnimCtrl    
        bne NoJump                
        lda A_B_Buttons           
        and #A_Button
        beq NoJump                
        and PreviousA_B_Buttons   
        beq ProcJumping
NoJump: jmp X_Physics             

ProcJumping:
           lda Player_State           
           beq InitJS                 
           lda SwimmingFlag           
           beq NoJump                 
           lda JumpSwimTimer          
           bne InitJS
           lda Player_Y_Speed         
           bpl InitJS                 
           jmp X_Physics              
InitJS:    lda #$20                   
           sta JumpSwimTimer
           ldy #$00                   
           sty Player_YMF_Dummy
           sty Player_Y_MoveForce
           lda Player_Y_HighPos       
           sta JumpOrigin_Y_HighPos   
           lda Player_Y_Position
           sta JumpOrigin_Y_Position
           lda #$01                   
           sta Player_State
           lda Player_XSpeedAbsolute  
           cmp #$09
           bcc ChkWtr                 
           iny                        
           cmp #$10
           bcc ChkWtr
           iny
           cmp #$19
           bcc ChkWtr
           iny
           cmp #$1c
           bcc ChkWtr                 
           iny
ChkWtr:    lda #$01                   
           sta DiffToHaltJump
           lda SwimmingFlag           
           beq GetYPhy
           ldy #$05                   
           lda Whirlpool_Flag         
           beq GetYPhy
           iny                        
GetYPhy:   lda JumpMForceData,y       
           sta VerticalForce          
           lda FallMForceData,y
           sta VerticalForceDown
           lda InitMForceData,y
           sta Player_Y_MoveForce
           lda PlayerYSpdData,y
           sta Player_Y_Speed
           lda SwimmingFlag           
           beq PJumpSnd
           lda #Sfx_EnemyStomp        
           sta Square1SoundQueue      
           lda Player_Y_Position
           cmp #$14                   
           bcs X_Physics              
           lda #$00                   
           sta Player_Y_Speed         
           jmp X_Physics              
PJumpSnd:  lda #Sfx_BigJump           
           ldy PlayerSize             
           beq SJumpSnd
           lda #Sfx_SmallJump         
SJumpSnd:  sta Square1SoundQueue      
X_Physics: ldy #$00
           sty $00                    
           lda Player_State           
           beq ProcPRun
           lda Player_XSpeedAbsolute  
           cmp #$19                   
           bcs GetXPhy                
           bcc ChkRFast               
ProcPRun:  iny                        
           lda AreaType               
           beq ChkRFast               
           dey                        
           lda Left_Right_Buttons     
           cmp Player_MovingDir       
           bne ChkRFast               
           lda A_B_Buttons            
           and #B_Button
           bne SetRTmr                
           lda RunningTimer           
           bne GetXPhy                
ChkRFast:  iny                        
           inc $00                    
           lda RunningSpeed
           bne FastXSp                
           lda Player_XSpeedAbsolute
           cmp #$21                   
           bcc GetXPhy                
FastXSp:   inc $00                    
           jmp GetXPhy                
SetRTmr:   lda #$0a                   
           sta RunningTimer
GetXPhy:   lda MaxLeftXSpdData,y      
           sta MaximumLeftSpeed
           lda GameEngineSubroutine   
           cmp #$07                   
           bne GetXPhy2               
           ldy #$03                   
GetXPhy2:  lda MaxRightXSpdData,y     
           sta MaximumRightSpeed
           ldy $00                    
           lda FrictionData,y         
           sta FrictionAdderLow
           lda #$00
           sta FrictionAdderHigh      
           lda PlayerFacingDir
           cmp Player_MovingDir       
           beq ExitPhy                
           asl FrictionAdderLow       
           rol FrictionAdderHigh      
ExitPhy:   rts                        

 

GetPlayerAnimSpeed:
            ldy #$00                   
            lda Player_XSpeedAbsolute  
            cmp #$1c                   
            bcs SetRunSpd              
            iny                        
            cmp #$0e                   
            bcs ChkSkid                
            iny                        
ChkSkid:    lda SavedJoypadBits        
            and #%01111111             
            beq SetAnimSpd             
            and #$03                   
            cmp Player_MovingDir       
            bne ProcSkid               
            lda #$00                   
SetRunSpd:  sta RunningSpeed           
            jmp SetAnimSpd
ProcSkid:   lda Player_XSpeedAbsolute  
            cmp #$0b                   
            bcs SetAnimSpd             
            lda PlayerFacingDir
            sta Player_MovingDir       
            lda #$00
            sta Player_X_Speed         
            sta Player_X_MoveForce     
SetAnimSpd: lda PlayerAnimTmrData,y    
            sta PlayerAnimTimerSet
            rts



ImposeFriction:
           and Player_CollisionBits  
           cmp #$00                  
           bne JoypFrict             
           lda Player_X_Speed
           beq SetAbsSpd             
           bpl RghtFrict             
           bmi LeftFrict             
JoypFrict: lsr                       
           bcc RghtFrict             
LeftFrict: lda Player_X_MoveForce    
           clc
           adc FrictionAdderLow      
           sta Player_X_MoveForce    
           lda Player_X_Speed
           adc FrictionAdderHigh     
           sta Player_X_Speed        
           cmp MaximumRightSpeed     
           bmi XSpdSign              
           lda MaximumRightSpeed     
           sta Player_X_Speed        
           jmp SetAbsSpd             
RghtFrict: lda Player_X_MoveForce    
           sec
           sbc FrictionAdderLow      
           sta Player_X_MoveForce    
           lda Player_X_Speed
           sbc FrictionAdderHigh     
           sta Player_X_Speed        
           cmp MaximumLeftSpeed      
           bpl XSpdSign              
           lda MaximumLeftSpeed      
           sta Player_X_Speed        
XSpdSign:  cmp #$00                  
           bpl SetAbsSpd             
           eor #$ff
           clc                       
           adc #$01                  
SetAbsSpd: sta Player_XSpeedAbsolute 
           rts






ProcFireball_Bubble:
      lda PlayerStatus           
      cmp #$02
      bcc ProcAirBubbles         
      lda A_B_Buttons
      and #B_Button              
      beq ProcFireballs          
      and PreviousA_B_Buttons
      bne ProcFireballs          
      lda FireballCounter        
      and #%00000001             
      tax
      lda Fireball_State,x       
      bne ProcFireballs          
      ldy Player_Y_HighPos       
      dey
      bne ProcFireballs
      lda CrouchingFlag          
      bne ProcFireballs
      lda Player_State           
      cmp #$03
      beq ProcFireballs
      lda #Sfx_Fireball          
      sta Square1SoundQueue
      lda #$02                   
      sta Fireball_State,x
      ldy PlayerAnimTimerSet     
      sty FireballThrowingTimer  
      dey
      sty PlayerAnimTimer        
      inc FireballCounter        

ProcFireballs:
      ldx #$00
      jsr FireballObjCore  
      ldx #$01
      jsr FireballObjCore  

ProcAirBubbles:
          lda AreaType                
          bne BublExit
          ldx #$02                    
BublLoop: stx ObjectOffset            
          jsr BubbleCheck             
          jsr RelativeBubblePosition  
          jsr GetBubbleOffscreenBits  
          jsr DrawBubble              
          dex
          bpl BublLoop                
BublExit: rts                         
 

FireballObjCore:
         stx ObjectOffset             
         lda Fireball_State,x         
         asl
         bcs FireballExplosion        
         ldy Fireball_State,x         
         beq NoFBall
         dey                          
         beq RunFB
         lda Player_X_Position        
         adc #$04                     
         sta Fireball_X_Position,x
         lda Player_PageLoc           
         adc #$00                     
         sta Fireball_PageLoc,x
         lda Player_Y_Position        
         sta Fireball_Y_Position,x
         lda #$01                     
         sta Fireball_Y_HighPos,x
         ldy PlayerFacingDir          
         dey                          
         lda FireballXSpdData,y       
         sta Fireball_X_Speed,x
         lda #$04                     
         sta Fireball_Y_Speed,x
         lda #$07
         sta Fireball_BoundBoxCtrl,x  
         dec Fireball_State,x         
RunFB:   txa                          
         clc                          
         adc #$07
         tax
         lda #$50                     
         sta $00
         lda #$03                     
         sta $02
         lda #$00
         jsr ImposeGravity            
         jsr MoveObjectHorizontally   
         ldx ObjectOffset             
         jsr RelativeFireballPosition 
         jsr GetFireballOffscreenBits 
         jsr GetFireballBoundBox      
         jsr FireballBGCollision      
         lda FBall_OffscreenBits      
         and #%11001100               
         bne EraseFB                  
         jsr FireballEnemyCollision   
         jmp DrawFireball             
EraseFB: lda #$00                     
         sta Fireball_State,x
NoFBall: rts                          

FireballExplosion:
      jsr RelativeFireballPosition
      jmp DrawExplosion_Fireball

BubbleCheck:
      lda PseudoRandomBitReg+1,x  
      and #$01
      sta $07                     
      lda Bubble_Y_Position,x     
      cmp #$f8                    
      bne MoveBubl                
      lda AirBubbleTimer          
      bne ExitBubl                

SetupBubble:
          ldy #$00                 
          lda PlayerFacingDir      
          lsr                      
          bcc PosBubl              
          ldy #$08                 
PosBubl:  tya                      
          adc Player_X_Position    
          sta Bubble_X_Position,x  
          lda Player_PageLoc
          adc #$00                 
          sta Bubble_PageLoc,x     
          lda Player_Y_Position
          clc                      
          adc #$08
          sta Bubble_Y_Position,x  
          lda #$01
          sta Bubble_Y_HighPos,x   
          ldy $07                  
          lda BubbleTimerData,y    
          sta AirBubbleTimer       
MoveBubl: ldy $07                  
          lda Bubble_YMF_Dummy,x
          sec                      
          sbc Bubble_MForceData,y
          sta Bubble_YMF_Dummy,x   
          lda Bubble_Y_Position,x
          sbc #$00                 
          cmp #$20                 
          bcs Y_Bubl               
          lda #$f8                 
Y_Bubl:   sta Bubble_Y_Position,x  
ExitBubl: rts                      

 

RunGameTimer:
           lda OperMode               
           beq ExGTimer               
           lda GameEngineSubroutine
           cmp #$08                   
           bcc ExGTimer               
           cmp #$0b                   
           beq ExGTimer               
           lda Player_Y_HighPos
           cmp #$02                   
           bcs ExGTimer               
           lda GameTimerCtrlTimer     
           bne ExGTimer               
           lda GameTimerDisplay
           ora GameTimerDisplay+1     
           ora GameTimerDisplay+2
           beq TimeUpOn               
           ldy GameTimerDisplay       
           dey                        
           bne ResGTCtrl              
           lda GameTimerDisplay+1     
           ora GameTimerDisplay+2
           bne ResGTCtrl              
           lda #TimeRunningOutMusic
           sta EventMusicQueue        
ResGTCtrl: lda #$18                   
           sta GameTimerCtrlTimer
           ldy #$23                   
           lda #$ff                   
           sta DigitModifier+5
           jsr DigitsMathRoutine      
           lda #$a4                   
           jmp PrintStatusBarNumbers  
TimeUpOn:  sta PlayerStatus           
           jsr ForceInjury            
           inc GameTimerExpiredFlag   
ExGTimer:  rts                        



WarpZoneObject:
      lda ScrollLock         
      beq ExGTimer           
      lda Player_Y_Position  
      and Player_Y_HighPos   
      bne ExGTimer           
      sta ScrollLock         
      inc WarpZoneControl    
      jmp EraseEnemyObject   









ProcessWhirlpools:
        lda AreaType                
        bne ExitWh                  
        sta Whirlpool_Flag          
        lda TimerControl            
        bne ExitWh                  
        ldy #$04                    
WhLoop: lda Whirlpool_LeftExtent,y  
        clc
        adc Whirlpool_Length,y      
        sta $02                     
        lda Whirlpool_PageLoc,y     
        beq NextWh                  
        adc #$00                    
        sta $01                     
        lda Player_X_Position       
        sec
        sbc Whirlpool_LeftExtent,y  
        lda Player_PageLoc          
        sbc Whirlpool_PageLoc,y     
        bmi NextWh                  
        lda $02                     
        sec
        sbc Player_X_Position       
        lda $01                     
        sbc Player_PageLoc          
        bpl WhirlpoolActivate       
NextWh: dey                         
        bpl WhLoop                  
ExitWh: rts                         

WhirlpoolActivate:
        lda Whirlpool_Length,y      
        lsr                         
        sta $00                     
        lda Whirlpool_LeftExtent,y  
        clc
        adc $00                     
        sta $01                     
        lda Whirlpool_PageLoc,y     
        adc #$00                    
        sta $00                     
        lda FrameCounter            
        lsr                         
        bcc WhPull                  
        lda $01                     
        sec
        sbc Player_X_Position       
        lda $00                     
        sbc Player_PageLoc          
        bpl LeftWh                  
        lda Player_X_Position       
        sec
        sbc #$01                    
        sta Player_X_Position       
        lda Player_PageLoc
        sbc #$00                    
        jmp SetPWh                  
LeftWh: lda Player_CollisionBits    
        lsr                         
        bcc WhPull                  
        lda Player_X_Position       
        clc
        adc #$01                    
        sta Player_X_Position       
        lda Player_PageLoc
        adc #$00                    
SetPWh: sta Player_PageLoc          
WhPull: lda #$10
        sta $00                     
        lda #$01
        sta Whirlpool_Flag          
        sta $02                     
        lsr
        tax                         
        jmp ImposeGravity           

 
FlagpoleRoutine:
           ldx #$05                  
           stx ObjectOffset          
           lda Enemy_ID,x
           cmp #FlagpoleFlagObject   
           bne ExitFlagP             
           lda GameEngineSubroutine
           cmp #$04                  
           bne SkipScore             
           lda Player_State
           cmp #$03                  
           bne SkipScore             
           lda Enemy_Y_Position,x    
           cmp #$aa                  
           bcs GiveFPScr             
           lda Player_Y_Position     
           cmp #$a2                  
           bcs GiveFPScr             
           lda Enemy_YMF_Dummy,x
           adc #$ff                  
           sta Enemy_YMF_Dummy,x     
           lda Enemy_Y_Position,x    
           adc #$01                  
           sta Enemy_Y_Position,x    
           lda FlagpoleFNum_YMFDummy
           sec                       
           sbc #$ff
           sta FlagpoleFNum_YMFDummy 
           lda FlagpoleFNum_Y_Pos
           sbc #$01                  
           sta FlagpoleFNum_Y_Pos    
SkipScore: jmp FPGfx                 
GiveFPScr: ldy FlagpoleScore         
           lda FlagpoleScoreMods,y   
           ldx FlagpoleScoreDigits,y 
           sta DigitModifier,x       
           jsr AddToScore            
           lda #$05
           sta GameEngineSubroutine  
FPGfx:     jsr GetEnemyOffscreenBits 
           jsr RelativeEnemyPosition 
           jsr FlagpoleGfxHandler    
ExitFlagP: rts

 
JumpspringHandler:
           jsr GetEnemyOffscreenBits   
           lda TimerControl            
           bne DrawJSpr                
           lda JumpspringAnimCtrl      
           beq DrawJSpr                
           tay
           dey                         
           tya                         
           and #%00000010              
           bne DownJSpr                
           inc Player_Y_Position
           inc Player_Y_Position       
           jmp PosJSpr                 
DownJSpr:  dec Player_Y_Position       
           dec Player_Y_Position
PosJSpr:   lda Jumpspring_FixedYPos,x  
           clc
           adc Jumpspring_Y_PosData,y  
           sta Enemy_Y_Position,x      
           cpy #$01                    
           bcc BounceJS                
           lda A_B_Buttons
           and #A_Button               
           beq BounceJS                
           and PreviousA_B_Buttons     
           bne BounceJS                
           lda #$f4
           sta JumpspringForce         
BounceJS:  cpy #$03                    
           bne DrawJSpr                
           lda JumpspringForce
           sta Player_Y_Speed          
           lda #$00
           sta JumpspringAnimCtrl      
DrawJSpr:  jsr RelativeEnemyPosition   
           jsr EnemyGfxHandler         
           jsr OffscreenBoundsCheck    
           lda JumpspringAnimCtrl      
           beq ExJSpring               
           lda JumpspringTimer
           bne ExJSpring               
           lda #$04
           sta JumpspringTimer         
           inc JumpspringAnimCtrl      
ExJSpring: rts                         



Setup_Vine:
        lda #VineObject          
        sta Enemy_ID,x           
        lda #$01
        sta Enemy_Flag,x         
        lda Block_PageLoc,y
        sta Enemy_PageLoc,x      
        lda Block_X_Position,y
        sta Enemy_X_Position,x   
        lda Block_Y_Position,y
        sta Enemy_Y_Position,x   
        ldy VineFlagOffset       
        bne NextVO               
        sta VineStart_Y_Position 
NextVO: txa                      
        sta VineObjOffset,y      
        inc VineFlagOffset       
        lda #Sfx_GrowVine
        sta Square2SoundQueue    
        rts



 

VineObjectHandler:
           cpx #$05                  
           bne ExitVH                
           ldy VineFlagOffset
           dey                       
           lda VineHeight
           cmp VineHeightData,y      
           beq RunVSubs              
           lda FrameCounter          
           lsr                       
           lsr
           bcc RunVSubs              
           lda Enemy_Y_Position+5
           sbc #$01                  
           sta Enemy_Y_Position+5    
           inc VineHeight            
RunVSubs:  lda VineHeight            
           cmp #$08                  
           bcc ExitVH
           jsr RelativeEnemyPosition 
           jsr GetEnemyOffscreenBits 
           ldy #$00                  
VDrawLoop: jsr DrawVine              
           iny                       
           cpy VineFlagOffset        
           bne VDrawLoop             
           lda Enemy_OffscreenBits
           and #%00001100            
           beq WrCMTile              
           dey                       
KillVine:  ldx VineObjOffset,y       
           jsr EraseEnemyObject      
           dey                       
           bpl KillVine              
           sta VineFlagOffset        
           sta VineHeight            
WrCMTile:  lda VineHeight            
           cmp #$20                  
           bcc ExitVH                
           ldx #$06                  
           lda #$01                  
           ldy #$1b                  
           jsr BlockBufferCollision  
           ldy $02
           cpy #$d0                  
           bcs ExitVH                
           lda ($06),y               
           bne ExitVH                
           lda #$26
           sta ($06),y               
ExitVH:    ldx ObjectOffset          
           rts

 
ProcessCannons:
           lda AreaType                
           beq ExCannon                
           ldx #$02
ThreeSChk: stx ObjectOffset            
           lda Enemy_Flag,x            
           bne Chk_BB                  
           lda PseudoRandomBitReg+1,x  
           ldy SecondaryHardMode       
           and CannonBitmasks,y        
           cmp #$06                    
           bcs Chk_BB                  
           tay                         
           lda Cannon_PageLoc,y        
           beq Chk_BB                  
           lda Cannon_Timer,y          
           beq FireCannon              
           sbc #$00                    
           sta Cannon_Timer,y          
           jmp Chk_BB                  

FireCannon:
          lda TimerControl           
          bne Chk_BB                 
          lda #$0e                   
          sta Cannon_Timer,y         
          lda Cannon_PageLoc,y       
          sta Enemy_PageLoc,x        
          lda Cannon_X_Position,y    
          sta Enemy_X_Position,x     
          lda Cannon_Y_Position,y    
          sec
          sbc #$08                   
          sta Enemy_Y_Position,x     
          lda #$01
          sta Enemy_Y_HighPos,x      
          sta Enemy_Flag,x           
          lsr                        
          sta Enemy_State,x          
          lda #$09
          sta Enemy_BoundBoxCtrl,x   
          lda #BulletBill_CannonVar
          sta Enemy_ID,x             
          jmp Next3Slt               
Chk_BB:   lda Enemy_ID,x             
          cmp #BulletBill_CannonVar
          bne Next3Slt               
          jsr OffscreenBoundsCheck   
          lda Enemy_Flag,x           
          beq Next3Slt               
          jsr GetEnemyOffscreenBits  
          jsr BulletBillHandler      
Next3Slt: dex                        
          bpl ThreeSChk              
ExCannon: rts                        

 
BulletBillHandler:
           lda TimerControl          
           bne RunBBSubs             
           lda Enemy_State,x
           bne ChkDSte               
           lda Enemy_OffscreenBits   
           and #%00001100            
           cmp #%00001100            
           beq KillBB                
           ldy #$01                  
           jsr PlayerEnemyDiff       
           bmi SetupBB               
           iny                       
SetupBB:   sty Enemy_MovingDir,x     
           dey                       
           lda BulletBillXSpdData,y  
           sta Enemy_X_Speed,x       
           lda $00                   
           adc #$28                  
           cmp #$50                  
           bcc KillBB                
           lda #$01
           sta Enemy_State,x         
           lda #$0a
           sta EnemyFrameTimer,x     
           lda #Sfx_Blast
           sta Square2SoundQueue     
ChkDSte:   lda Enemy_State,x         
           and #%00100000
           beq BBFly                 
           jsr MoveD_EnemyVertically 
BBFly:     jsr MoveEnemyHorizontally 
RunBBSubs: jsr GetEnemyOffscreenBits 
           jsr RelativeEnemyPosition 
           jsr GetEnemyBoundBox      
           jsr PlayerEnemyCollision  
           jmp EnemyGfxHandler       
KillBB:    jsr EraseEnemyObject      
           rts

 

SpawnHammerObj:
          lda PseudoRandomBitReg+1 
          and #%00000111           
          bne SetMOfs              
          lda PseudoRandomBitReg+1
          and #%00001000           
SetMOfs:  tay                      
          lda Misc_State,y         
          bne NoHammer             
          ldx HammerEnemyOfsData,y 
          lda Enemy_Flag,x         
          bne NoHammer             
          ldx ObjectOffset         
          txa
          sta HammerEnemyOffset,y  
          lda #$90
          sta Misc_State,y         
          lda #$07
          sta Misc_BoundBoxCtrl,y  
          sec                      
          rts
NoHammer: ldx ObjectOffset         
          clc                      
          rts






ProcHammerObj:
          lda TimerControl           
          bne RunHSubs               
          lda Misc_State,x           
          and #%01111111             
          ldy HammerEnemyOffset,x    
          cmp #$02                   
          beq SetHSpd                
          bcs SetHPos                
          txa
          clc                        
          adc #$0d                   
          tax                        
          lda #$10
          sta $00                    
          lda #$0f
          sta $01                    
          lda #$04
          sta $02                    
          lda #$00                   
          jsr ImposeGravity          
          jsr MoveObjectHorizontally 
          ldx ObjectOffset           
          jmp RunAllH                
SetHSpd:  lda #$fe
          sta Misc_Y_Speed,x         
          lda Enemy_State,y          
          and #%11110111             
          sta Enemy_State,y          
          ldx Enemy_MovingDir,y      
          dex                        
          lda HammerXSpdData,x       
          ldx ObjectOffset           
          sta Misc_X_Speed,x         
SetHPos:  dec Misc_State,x           
          lda Enemy_X_Position,y     
          clc
          adc #$02                   
          sta Misc_X_Position,x      
          lda Enemy_PageLoc,y        
          adc #$00                   
          sta Misc_PageLoc,x         
          lda Enemy_Y_Position,y     
          sec
          sbc #$0a                   
          sta Misc_Y_Position,x      
          lda #$01
          sta Misc_Y_HighPos,x       
          bne RunHSubs               
RunAllH:  jsr PlayerHammerCollision  
RunHSubs: jsr GetMiscOffscreenBits   
          jsr RelativeMiscPosition   
          jsr GetMiscBoundBox        
          jsr DrawHammer             
          rts                        





CoinBlock:
      jsr FindEmptyMiscSlot   
      lda Block_PageLoc,x     
      sta Misc_PageLoc,y      
      lda Block_X_Position,x  
      ora #$05                
      sta Misc_X_Position,y   
      lda Block_Y_Position,x  
      sbc #$10                
      sta Misc_Y_Position,y   
      jmp JCoinC              

SetupJumpCoin:
        jsr FindEmptyMiscSlot  
        lda Block_PageLoc2,x   
        sta Misc_PageLoc,y     
        lda $06                
        asl
        asl                    
        asl
        asl
        ora #$05               
        sta Misc_X_Position,y  
        lda $02                
        adc #$20               
        sta Misc_Y_Position,y  
JCoinC: lda #$fb
        sta Misc_Y_Speed,y     
        lda #$01
        sta Misc_Y_HighPos,y   
        sta Misc_State,y       
        sta Square2SoundQueue  
        stx ObjectOffset       
        jsr GiveOneCoin        
        inc CoinTallyFor1Ups   
        rts

FindEmptyMiscSlot:
           ldy #$08                
FMiscLoop: lda Misc_State,y        
           beq UseMiscS            
           dey                     
           cpy #$05                
           bne FMiscLoop           
           ldy #$08                
UseMiscS:  sty JumpCoinMiscOffset  
           rts



MiscObjectsCore:
          ldx #$08          
MiscLoop: stx ObjectOffset  
          lda Misc_State,x  
          beq MiscLoopBack  
          asl               
          bcc ProcJumpCoin  
          jsr ProcHammerObj 
          jmp MiscLoopBack  






ProcJumpCoin:
           ldy Misc_State,x          
           dey                       
           beq JCoinRun              
           inc Misc_State,x          
           lda Misc_X_Position,x     
           clc                       
           adc ScrollAmount          
           sta Misc_X_Position,x     
           lda Misc_PageLoc,x        
           adc #$00                  
           sta Misc_PageLoc,x        
           lda Misc_State,x
           cmp #$30                  
           bne RunJCSubs             
           lda #$00
           sta Misc_State,x          
           jmp MiscLoopBack          
JCoinRun:  txa             
           clc                       
           adc #$0d
           tax
           lda #$50                  
           sta $00
           lda #$06                  
           sta $02
           lsr                       
           sta $01                   
           lda #$00                  
           jsr ImposeGravity         
           ldx ObjectOffset          
           lda Misc_Y_Speed,x        
           cmp #$05
           bne RunJCSubs             
           inc Misc_State,x          
RunJCSubs: jsr RelativeMiscPosition  
           jsr GetMiscOffscreenBits  
           jsr GetMiscBoundBox       
           jsr JCoinGfxHandler       

MiscLoopBack: 
           dex                       
           bpl MiscLoop              
           rts                       


 

GiveOneCoin:
      lda #$01               
      sta DigitModifier+5    
      ldx CurrentPlayer      
      ldy CoinTallyOffsets,x 
      jsr DigitsMathRoutine  
      inc CoinTally          
      lda CoinTally
      cmp #100               
      bne CoinPoints         
      lda #$00
      sta CoinTally          
      inc NumberofLives      
      lda #Sfx_ExtraLife
      sta Square2SoundQueue  

CoinPoints:
      lda #$02               
      sta DigitModifier+4    

AddToScore:
      ldx CurrentPlayer      
      ldy ScoreOffsets,x     
      jsr DigitsMathRoutine  

GetSBNybbles:
      ldy CurrentPlayer      
      lda StatusBarNybbles,y 

UpdateNumber:
        jsr PrintStatusBarNumbers 
        ldy VRAM_Buffer1_Offset   
        lda VRAM_Buffer1-6,y      
        bne NoZSup                
        lda #$24
        sta VRAM_Buffer1-6,y
NoZSup: ldx ObjectOffset          
        rts



SetupPowerUp:
           lda #PowerUpObject        
           sta Enemy_ID+5            
           lda Block_PageLoc,x       
           sta Enemy_PageLoc+5       
           lda Block_X_Position,x    
           sta Enemy_X_Position+5    
           lda #$01
           sta Enemy_Y_HighPos+5     
           lda Block_Y_Position,x    
           sec
           sbc #$08                  
           sta Enemy_Y_Position+5    
PwrUpJmp:  lda #$01                  
           sta Enemy_State+5         
           sta Enemy_Flag+5          
           lda #$03
           sta Enemy_BoundBoxCtrl+5  
           lda PowerUpType
           cmp #$02                  
           bcs PutBehind             
           lda PlayerStatus          
           cmp #$02
           bcc StrType               
           lsr                       
StrType:   sta PowerUpType           
PutBehind: lda #%00100000
           sta Enemy_SprAttrib+5     
           lda #Sfx_GrowPowerUp
           sta Square2SoundQueue     
           rts



PowerUpObjHandler:
         ldx #$05                   
         stx ObjectOffset
         lda Enemy_State+5          
         beq ExitPUp                
         asl                        
         bcc GrowThePowerUp         
         lda TimerControl           
         bne RunPUSubs              
         lda PowerUpType            
         beq ShroomM                
         cmp #$03
         beq ShroomM                
         cmp #$02
         bne RunPUSubs              
         jsr MoveJumpingEnemy       
         jsr EnemyJump              
         jmp RunPUSubs              
ShroomM: jsr MoveNormalEnemy        
         jsr EnemyToBGCollisionDet  
         jmp RunPUSubs              

GrowThePowerUp:
           lda FrameCounter           
           and #$03                   
           bne ChkPUSte               
           dec Enemy_Y_Position+5     
           lda Enemy_State+5          
           inc Enemy_State+5          
           cmp #$11                   
           bcc ChkPUSte               
           lda #$10
           sta Enemy_X_Speed,x        
           lda #%10000000
           sta Enemy_State+5          
           asl                        
           sta Enemy_SprAttrib+5      
           rol                        
           sta Enemy_MovingDir,x      
ChkPUSte:  lda Enemy_State+5          
           cmp #$06                   
           bcc ExitPUp                
RunPUSubs: jsr RelativeEnemyPosition  
           jsr GetEnemyOffscreenBits  
           jsr GetEnemyBoundBox       
           jsr DrawPowerUp            
           jsr PlayerEnemyCollision   
           jsr OffscreenBoundsCheck   
ExitPUp:   rts                        



 
PlayerHeadCollision:
           pha                      
           lda #$11                 
           ldx SprDataOffset_Ctrl   
           ldy PlayerSize           
           bne DBlockSte            
           lda #$12                 
DBlockSte: sta Block_State,x        
           jsr DestroyBlockMetatile 
           ldx SprDataOffset_Ctrl   
           lda $02                  
           sta Block_Orig_YPos,x    
           tay
           lda $06                  
           sta Block_BBuf_Low,x     
           lda ($06),y              
           jsr BlockBumpedChk       
           sta $00                  
           ldy PlayerSize           
           bne ChkBrick             
           tya                      
ChkBrick:  bcc PutMTileB            
           ldy #$11                 
           sty Block_State,x        
           lda #$c4                 
           ldy $00                  
           cpy #$58                 
           beq StartBTmr            
           cpy #$5d                 
           bne PutMTileB            
StartBTmr: lda BrickCoinTimerFlag   
           bne ContBTmr             
           lda #$0b
           sta BrickCoinTimer       
           inc BrickCoinTimerFlag   
ContBTmr:  lda BrickCoinTimer       
           bne PutOldMT             
           ldy #$c4                 
PutOldMT:  tya                      
PutMTileB: sta Block_Metatile,x     
           jsr InitBlock_XY_Pos     
           ldy $02                  
           lda #$23
           sta ($06),y              
           lda #$10
           sta BlockBounceTimer     
           pla                      
           sta $05                  
           ldy #$00                 
           lda CrouchingFlag        
           bne SmallBP              
           lda PlayerSize           
           beq BigBP                
SmallBP:   iny                      
BigBP:     lda Player_Y_Position    
           clc
           adc BlockYPosAdderData,y 
           and #$f0                 
           sta Block_Y_Position,x   
           ldy Block_State,x        
           cpy #$11
           beq Unbreak              
           jsr BrickShatter         
           jmp InvOBit              
Unbreak:   jsr BumpBlock            
InvOBit:   lda SprDataOffset_Ctrl   
           eor #$01                 
           sta SprDataOffset_Ctrl
           rts                      



InitBlock_XY_Pos:
      lda Player_X_Position   
      clc
      adc #$08                
      and #$f0                
      sta Block_X_Position,x  
      lda Player_PageLoc
      adc #$00                
      sta Block_PageLoc,x     
      sta Block_PageLoc2,x    
      lda Player_Y_HighPos
      sta Block_Y_HighPos,x   
      rts                     



BumpBlock:
           jsr CheckTopOfBlock     
           lda #Sfx_Bump
           sta Square1SoundQueue   
           lda #$00
           sta Block_X_Speed,x     
           sta Block_Y_MoveForce,x 
           sta Player_Y_Speed      
           lda #$fe
           sta Block_Y_Speed,x     
           lda $05                 
           jsr BlockBumpedChk      
           bcc ExitBlockChk        
           tya                     
           cmp #$09                
           bcc BlockCode           
           sbc #$05                
BlockCode: jsr JumpEngine          
 


MushFlowerBlock:
      lda #$00      
StarBlock:
      lda #$02       

ExtraLifeMushBlock:
      lda #$03         
      sta $39          
      jmp SetupPowerUp

VineBlock:
      ldx #$05                
      ldy SprDataOffset_Ctrl  
      jsr Setup_Vine          

ExitBlockChk:
      rts                     

 

BlockBumpedChk:
             ldy #$0d                    
BumpChkLoop: cmp BrickQBlockMetatiles,y  
             beq MatchBump               
             dey                         
             bpl BumpChkLoop             
             clc                         
MatchBump:   rts                         



BrickShatter:
      jsr CheckTopOfBlock    
      lda #Sfx_BrickShatter
      sta Block_RepFlag,x    
      sta NoiseSoundQueue    
      jsr SpawnBrickChunks   
      lda #$fe
      sta Player_Y_Speed     
      lda #$05
      sta DigitModifier+5    
      jsr AddToScore         
      ldx SprDataOffset_Ctrl 
      rts



CheckTopOfBlock:
       ldx SprDataOffset_Ctrl  
       ldy $02                 
       beq TopEx               
       tya                     
       sec
       sbc #$10                
       sta $02                 
       tay 
       lda ($06),y             
       cmp #$c2                
       bne TopEx               
       lda #$00
       sta ($06),y             
       jsr RemoveCoin_Axe      
       ldx SprDataOffset_Ctrl  
       jsr SetupJumpCoin       
TopEx: rts                     



SpawnBrickChunks:
      lda Block_X_Position,x     
      sta Block_Orig_XPos,x      
      lda #$f0
      sta Block_X_Speed,x        
      sta Block_X_Speed+2,x
      lda #$fa
      sta Block_Y_Speed,x        
      lda #$fc
      sta Block_Y_Speed+2,x      
      lda #$00
      sta Block_Y_MoveForce,x    
      sta Block_Y_MoveForce+2,x
      lda Block_PageLoc,x
      sta Block_PageLoc+2,x      
      lda Block_X_Position,x
      sta Block_X_Position+2,x   
      lda Block_Y_Position,x
      clc                        
      adc #$08                   
      sta Block_Y_Position+2,x
      lda #$fa
      sta Block_Y_Speed,x        
      rts



BlockObjectsCore:
        lda Block_State,x           
        beq UpdSte                  
        and #$0f                    
        pha                         
        tay                         
        txa
        clc
        adc #$09                    
        tax                         
        dey                         
        beq BouncingBlockHandler    
        jsr ImposeGravityBlock      
        jsr MoveObjectHorizontally  
        txa
        clc                         
        adc #$02
        tax
        jsr ImposeGravityBlock      
        jsr MoveObjectHorizontally  
        ldx ObjectOffset            
        jsr RelativeBlockPosition   
        jsr GetBlockOffscreenBits   
        jsr DrawBrickChunks         
        pla                         
        ldy Block_Y_HighPos,x       
        beq UpdSte                  
        pha                         
        lda #$f0
        cmp Block_Y_Position+2,x    
        bcs ChkTop                  
        sta Block_Y_Position+2,x    
ChkTop: lda Block_Y_Position,x      
        cmp #$f0                    
        pla                         
        bcc UpdSte                  
        bcs KillBlock               

BouncingBlockHandler:
           jsr ImposeGravityBlock     
           ldx ObjectOffset           
           jsr RelativeBlockPosition  
           jsr GetBlockOffscreenBits  
           jsr DrawBlock              
           lda Block_Y_Position,x     
           and #$0f                   
           cmp #$05                   
           pla                        
           bcs UpdSte                 
           lda #$01
           sta Block_RepFlag,x        
KillBlock: lda #$00                   
UpdSte:    sta Block_State,x          
           rts





BlockObjMT_Updater:
            ldx #$01                  
UpdateLoop: stx ObjectOffset          
            lda VRAM_Buffer1          
            bne NextBUpd              
            lda Block_RepFlag,x       
            beq NextBUpd              
            lda Block_BBuf_Low,x      
            sta $06                   
            lda #$05
            sta $07                   
            lda Block_Orig_YPos,x     
            sta $02                   
            tay
            lda Block_Metatile,x      
            sta ($06),y               
            jsr ReplaceBlockMetatile  
            lda #$00
            sta Block_RepFlag,x       
NextBUpd:   dex                       
            bpl UpdateLoop            
            rts                       






MoveEnemyHorizontally:
      inx                         
      jsr MoveObjectHorizontally  
      ldx ObjectOffset            
      rts                         

MovePlayerHorizontally:
      lda JumpspringAnimCtrl  
      bne ExXMove             
      tax                     

MoveObjectHorizontally:
          lda SprObject_X_Speed,x     
          asl                         
          asl                         
          asl
          asl
          sta $01                     
          lda SprObject_X_Speed,x     
          lsr                         
          lsr
          lsr
          lsr
          cmp #$08                    
          bcc SaveXSpd
          ora #%11110000              
SaveXSpd: sta $00                     
          ldy #$00                    
          cmp #$00                    
          bpl UseAdder
          dey                         
UseAdder: sty $02                     
          lda SprObject_X_MoveForce,x 
          clc
          adc $01                     
          sta SprObject_X_MoveForce,x 
          lda #$00                    
          rol                         
          pha                         
          ror                         
          lda SprObject_X_Position,x
          adc $00                     
          sta SprObject_X_Position,x  
          lda SprObject_PageLoc,x
          adc $02                     
          sta SprObject_PageLoc,x     
          pla
          clc                         
          adc $00                     
ExXMove:  rts                         






MovePlayerVertically:
         ldx #$00                
         lda TimerControl
         bne NoJSChk             
         lda JumpspringAnimCtrl  
         bne ExXMove             
NoJSChk: lda VerticalForce       
         sta $00
         lda #$04                
         jmp ImposeGravitySprObj 



MoveD_EnemyVertically:
      ldy #$3d           
      lda Enemy_State,x  
      cmp #$05           
      bne ContVMove      

MoveFallingPlatform:
           ldy #$20       
ContVMove: jmp SetHiMax   



MoveRedPTroopaDown:
      ldy #$00            
      jmp MoveRedPTroopa  

MoveRedPTroopaUp:
      ldy #$01            

MoveRedPTroopa:
      inx                 
      lda #$03
      sta $00             
      lda #$06
      sta $01             
      lda #$02
      sta $02             
      tya                 
      jmp RedPTroopaGrav  



MoveDropPlatform:
      ldy #$7f      
      bne SetMdMax  

MoveEnemySlowVert:
          ldy #$0f         
SetMdMax: lda #$02         
          bne SetXMoveAmt  



MoveJ_EnemyVertically:
             ldy #$1c                
SetHiMax:    lda #$03                
SetXMoveAmt: sty $00                 
             inx                     
             jsr ImposeGravitySprObj 
             ldx ObjectOffset        
             rts

 

ResidualGravityCode:
      ldy #$00        

ImposeGravityBlock:
      ldy #$01       
      lda #$50       
      sta $00
      lda MaxSpdBlockData,y    

ImposeGravitySprObj:
      sta $02            
      lda #$00           
      jmp ImposeGravity  



MovePlatformDown:
      lda #$00    


MovePlatformUp:
           lda #$01        
           pha
           ldy Enemy_ID,x  
           inx             
           lda #$05        
           cpy #$29        
           bne SetDplSpd   
           lda #$09        
SetDplSpd: sta $00         
           lda #$0a        
           sta $01
           lda #$03        
           sta $02
           pla             
           tay             

RedPTroopaGrav:
      jsr ImposeGravity  
      ldx ObjectOffset   
      rts






ImposeGravity:
         pha                          
         lda SprObject_YMF_Dummy,x
         clc                          
         adc SprObject_Y_MoveForce,x
         sta SprObject_YMF_Dummy,x
         ldy #$00                     
         lda SprObject_Y_Speed,x      
         bpl AlterYP                  
         dey                          
AlterYP: sty $07                      
         adc SprObject_Y_Position,x   
         sta SprObject_Y_Position,x   
         lda SprObject_Y_HighPos,x
         adc $07                      
         sta SprObject_Y_HighPos,x    
         lda SprObject_Y_MoveForce,x
         clc
         adc $00                      
         sta SprObject_Y_MoveForce,x
         lda SprObject_Y_Speed,x      
         adc #$00
         sta SprObject_Y_Speed,x
         cmp $02                      
         bmi ChkUpM                   
         lda SprObject_Y_MoveForce,x
         cmp #$80                     
         bcc ChkUpM
         lda $02
         sta SprObject_Y_Speed,x      
         lda #$00
         sta SprObject_Y_MoveForce,x  
ChkUpM:  pla                          
         beq ExVMove                  
         lda $02
         eor #%11111111               
         tay
         iny
         sty $07                      
         lda SprObject_Y_MoveForce,x
         sec                          
         sbc $01                      
         sta SprObject_Y_MoveForce,x  
         lda SprObject_Y_Speed,x
         sbc #$00                     
         sta SprObject_Y_Speed,x
         cmp $07                      
         bpl ExVMove                  
         lda SprObject_Y_MoveForce,x
         cmp #$80                     
         bcs ExVMove                  
         lda $07
         sta SprObject_Y_Speed,x      
         lda #$ff
         sta SprObject_Y_MoveForce,x  
ExVMove: rts                          



EnemiesAndLoopsCore:
            lda Enemy_Flag,x         
            pha                      
            asl
            bcs ChkBowserF           
            pla                      
            beq ChkAreaTsk           
            jmp RunEnemyObjectsCore  
ChkAreaTsk: lda AreaParserTaskNum    
            and #$07
            cmp #$07                 
            beq ExitELCore
            jmp ProcLoopCommand      
ChkBowserF: pla                      
            and #%00001111           
            tay
            lda Enemy_Flag,y         
            bne ExitELCore
            sta Enemy_Flag,x         
ExitELCore: rts




LoopCmdWorldNumber:


LoopCmdPageNumber:


LoopCmdYPosition:


ExecGameLoopback:
      lda Player_PageLoc        
      sec
      sbc #$04
      sta Player_PageLoc
      lda CurrentPageLoc        
      sec
      sbc #$04
      sta CurrentPageLoc
      lda ScreenLeft_PageLoc    
      sec                       
      sbc #$04
      sta ScreenLeft_PageLoc
      lda ScreenRight_PageLoc   
      sec                       
      sbc #$04
      sta ScreenRight_PageLoc
      lda AreaObjectPageLoc     
      sec                       
      sbc #$04
      sta AreaObjectPageLoc
      lda #$00                  
      sta EnemyObjectPageSel    
      sta AreaObjectPageSel
      sta EnemyDataOffset       
      sta EnemyObjectPageLoc    
      lda AreaDataOfsLoopback,y 
      sta AreaDataOffset        
      rts

ProcLoopCommand:
          lda LoopCommand           
          beq ChkEnemyFrenzy
          lda CurrentColumnPos      
          bne ChkEnemyFrenzy        
          ldy #$0b                  
FindLoop: dey
          bmi ChkEnemyFrenzy        
          lda WorldNumber           
          cmp LoopCmdWorldNumber,y  
          bne FindLoop
          lda CurrentPageLoc        
          cmp LoopCmdPageNumber,y   
          bne FindLoop
          lda Player_Y_Position     
          cmp LoopCmdYPosition,y    
          bne WrongChk
          lda Player_State          
          cmp #$00                  
          bne WrongChk              
          lda WorldNumber           
          cmp #World7               
          bne InitMLp               
          inc MultiLoopCorrectCntr  
IncMLoop: inc MultiLoopPassCntr     
          lda MultiLoopPassCntr     
          cmp #$03
          bne InitLCmd              
          lda MultiLoopCorrectCntr  
          cmp #$03
          beq InitMLp               
          bne DoLpBack              
WrongChk: lda WorldNumber           
          cmp #World7               
          beq IncMLoop
DoLpBack: jsr ExecGameLoopback      
          jsr KillAllEnemies
InitMLp:  lda #$00                  
          sta MultiLoopPassCntr
          sta MultiLoopCorrectCntr
InitLCmd: lda #$00                  
          sta LoopCommand



ChkEnemyFrenzy:
      lda EnemyFrenzyQueue  
      beq ProcessEnemyData  
      sta Enemy_ID,x        
      lda #$01
      sta Enemy_Flag,x      
      lda #$00
      sta Enemy_State,x     
      sta EnemyFrenzyQueue
      jmp InitEnemyObject   





ProcessEnemyData:
        ldy EnemyDataOffset      
        lda (EnemyData),y        
        cmp #$ff                 
        bne CheckEndofBuffer
        jmp CheckFrenzyBuffer    

CheckEndofBuffer:
        and #%00001111           
        cmp #$0e
        beq CheckRightBounds     
        cpx #$05                 
        bcc CheckRightBounds     
        iny
        lda (EnemyData),y        
        and #%00111111           
        cmp #$2e                 
        beq CheckRightBounds     
        rts                      

CheckRightBounds:
        lda ScreenRight_X_Pos    
        clc
        adc #$30
        and #%11110000           
        sta $07
        lda ScreenRight_PageLoc  
        adc #$00
        sta $06                  
        ldy EnemyDataOffset
        iny
        lda (EnemyData),y        
        asl
        bcc CheckPageCtrlRow
        lda EnemyObjectPageSel   
        bne CheckPageCtrlRow
        inc EnemyObjectPageSel   
        inc EnemyObjectPageLoc   

CheckPageCtrlRow:
        dey
        lda (EnemyData),y        
        and #$0f
        cmp #$0f                 
        bne PositionEnemyObj     
        lda EnemyObjectPageSel   
        bne PositionEnemyObj     
        iny
        lda (EnemyData),y        
        and #%00111111
        sta EnemyObjectPageLoc   
        inc EnemyDataOffset      
        inc EnemyDataOffset
        inc EnemyObjectPageSel   
        jmp ProcLoopCommand      

PositionEnemyObj:
        lda EnemyObjectPageLoc   
        sta Enemy_PageLoc,x      
        lda (EnemyData),y        
        and #%11110000
        sta Enemy_X_Position,x   
        cmp ScreenRight_X_Pos    
        lda Enemy_PageLoc,x      
        sbc ScreenRight_PageLoc  
        bcs CheckRightExtBounds  
        lda (EnemyData),y
        and #%00001111           
        cmp #$0e                 
        beq ParseRow0e
        jmp CheckThreeBytes      

CheckRightExtBounds:
        lda $07                  
        cmp Enemy_X_Position,x   
        lda $06                  
        sbc Enemy_PageLoc,x      
        bcc CheckFrenzyBuffer    
        lda #$01                 
        sta Enemy_Y_HighPos,x
        lda (EnemyData),y        
        asl                      
        asl                      
        asl
        asl
        sta Enemy_Y_Position,x
        cmp #$e0                 
        beq ParseRow0e           
        iny
        lda (EnemyData),y        
        and #%01000000           
        beq CheckForEnemyGroup   
        lda SecondaryHardMode    
        beq Inc2B                

CheckForEnemyGroup:
        lda (EnemyData),y      
        and #%00111111
        cmp #$37               
        bcc BuzzyBeetleMutate
        cmp #$3f               
        bcc DoGroup            

BuzzyBeetleMutate:
        cmp #Goomba          
        bne StrID            
        ldy PrimaryHardMode  
        beq StrID            
        lda #BuzzyBeetle
StrID:  sta Enemy_ID,x       
        lda #$01
        sta Enemy_Flag,x     
        jsr InitEnemyObject
        lda Enemy_Flag,x     
        bne Inc2B            
        rts

CheckFrenzyBuffer:
        lda EnemyFrenzyBuffer    
        bne StrFre               
        lda VineFlagOffset       
        cmp #$01
        bne ExEPar               
        lda #VineObject          
StrFre: sta Enemy_ID,x           

InitEnemyObject:
        lda #$00                 
        sta Enemy_State,x
        jsr CheckpointEnemyID    
ExEPar: rts                      

DoGroup:
        jmp HandleGroupEnemies   

ParseRow0e:
        iny                      
        iny
        lda (EnemyData),y
        lsr                      
        lsr                      
        lsr
        lsr
        lsr
        cmp WorldNumber          
        bne NotUse               
        dey                      
        lda (EnemyData),y        
        sta AreaPointer          
        iny
        lda (EnemyData),y        
        and #%00011111           
        sta EntrancePage         
NotUse: jmp Inc3B

CheckThreeBytes:
        ldy EnemyDataOffset      
        lda (EnemyData),y        
        and #%00001111           
        cmp #$0e
        bne Inc2B
Inc3B:  inc EnemyDataOffset      
Inc2B:  inc EnemyDataOffset      
        inc EnemyDataOffset
        lda #$00                 
        sta EnemyObjectPageSel
        ldx ObjectOffset         
        rts                      

CheckpointEnemyID:
        lda Enemy_ID,x
        cmp #$15                     
        bcs InitEnemyRoutines        
        tay                          
        lda Enemy_Y_Position,x
        adc #$08                     
        sta Enemy_Y_Position,x       
        lda #$01
        sta EnemyOffscrBitsMasked,x  
        tya                          

InitEnemyRoutines:
        jsr JumpEngine


























































NoInitCode:
      rts               



InitGoomba:
      jsr InitNormalEnemy  
      jmp SmallBBox        



InitPodoboo:
      lda #$02                  
      sta Enemy_Y_HighPos,x     
      sta Enemy_Y_Position,x
      lsr
      sta EnemyIntervalTimer,x  
      lsr
      sta Enemy_State,x         
      jmp SmallBBox             



InitRetainerObj:
      lda #$b8                
      sta Enemy_Y_Position,x  
      rts



NormalXSpdData:


InitNormalEnemy:
         ldy #$01              
         lda PrimaryHardMode   
         bne GetESpd
         dey                   
GetESpd: lda NormalXSpdData,y  
SetESpd: sta Enemy_X_Speed,x   
         jmp TallBBox          



InitRedKoopa:
      jsr InitNormalEnemy   
      lda #$01              
      sta Enemy_State,x
      rts



HBroWalkingTimerData:


InitHammerBro:
      lda #$00                    
      sta HammerThrowingTimer,x   
      sta Enemy_X_Speed,x
      ldy SecondaryHardMode       
      lda HBroWalkingTimerData,y
      sta EnemyIntervalTimer,x    
      lda #$0b                    
      jmp SetBBox



InitHorizFlySwimEnemy:
      lda #$00        
      jmp SetESpd



InitBloober:
           lda #$00               
           sta BlooperMoveSpeed,x
SmallBBox: lda #$09               
           bne SetBBox            



InitRedPTroopa:
          ldy #$30                    
          lda Enemy_Y_Position,x      
          sta RedPTroopaOrigXPos,x    
          bpl GetCent                 
          ldy #$e0                    
GetCent:  tya                         
          adc Enemy_Y_Position,x      
          sta RedPTroopaCenterYPos,x  
TallBBox: lda #$03                    
SetBBox:  sta Enemy_BoundBoxCtrl,x    
          lda #$02                    
          sta Enemy_MovingDir,x
InitVStf: lda #$00                    
          sta Enemy_Y_Speed,x         
          sta Enemy_Y_MoveForce,x
          rts



InitBulletBill:
      lda #$02                  
      sta Enemy_MovingDir,x
      lda #$09                  
      sta Enemy_BoundBoxCtrl,x
      rts



InitCheepCheep:
      jsr SmallBBox              
      lda PseudoRandomBitReg,x   
      and #%00010000             
      sta CheepCheepMoveMFlag,x  
      lda Enemy_Y_Position,x
      sta CheepCheepOrigYPos,x   
      rts



InitLakitu:
      lda EnemyFrenzyBuffer      
      bne KillLakitu             

SetupLakitu:
      lda #$00                   
      sta LakituReappearTimer
      jsr InitHorizFlySwimEnemy  
      jmp TallBBox2              

KillLakitu:
      jmp EraseEnemyObject




PRDiffAdjustData:




LakituAndSpinyHandler:
          lda FrenzyEnemyTimer    
          bne ExLSHand
          cpx #$05                
          bcs ExLSHand
          lda #$80                
          sta FrenzyEnemyTimer
          ldy #$04                
ChkLak:   lda Enemy_ID,y          
          cmp #Lakitu             
          beq CreateSpiny         
          dey                     
          bpl ChkLak              
          inc LakituReappearTimer 
          lda LakituReappearTimer
          cmp #$07                
          bcc ExLSHand            
          ldx #$04                
ChkNoEn:  lda Enemy_Flag,x        
          beq CreateL             
          dex                     
          bpl ChkNoEn             
          bmi RetEOfs             
CreateL:  lda #$00                
          sta Enemy_State,x
          lda #Lakitu             
          sta Enemy_ID,x
          jsr SetupLakitu         
          lda #$20
          jsr PutAtRightExtent    
RetEOfs:  ldx ObjectOffset        
ExLSHand: rts



CreateSpiny:
          lda Player_Y_Position      
          cmp #$2c
          bcc ExLSHand
          lda Enemy_State,y          
          bne ExLSHand
          lda Enemy_PageLoc,y        
          sta Enemy_PageLoc,x        
          lda Enemy_X_Position,y
          sta Enemy_X_Position,x
          lda #$01                   
          sta Enemy_Y_HighPos,x
          lda Enemy_Y_Position,y     
          sec
          sbc #$08
          sta Enemy_Y_Position,x
          lda PseudoRandomBitReg,x   
          and #%00000011
          tay
          ldx #$02
DifLoop:  lda PRDiffAdjustData,y     
          sta $01,x                  
          iny
          iny                        
          iny
          iny
          dex                        
          bpl DifLoop                
          ldx ObjectOffset           
          jsr PlayerLakituDiff       
          ldy Player_X_Speed         
          cpy #$08
          bcs SetSpSpd               
          tay                        
          lda PseudoRandomBitReg+1,x
          and #%00000011             
          beq UsePosv                
          tya
          eor #%11111111             
          tay
          iny
UsePosv:  tya                        
SetSpSpd: jsr SmallBBox              
          ldy #$02
          sta Enemy_X_Speed,x        
          cmp #$00                   
          bmi SpinyRte               
          dey
SpinyRte: sty Enemy_MovingDir,x      
          lda #$fd
          sta Enemy_Y_Speed,x        
          lda #$01
          sta Enemy_Flag,x           
          lda #$05
          sta Enemy_State,x          
ChpChpEx: rts



FirebarSpinSpdData:


FirebarSpinDirData:


InitLongFirebar:
      jsr DuplicateEnemyObj       

InitShortFirebar:
      lda #$00                    
      sta FirebarSpinState_Low,x
      lda Enemy_ID,x              
      sec                         
      sbc #$1b
      tay
      lda FirebarSpinSpdData,y    
      sta FirebarSpinSpeed,x
      lda FirebarSpinDirData,y    
      sta FirebarSpinDirection,x
      lda Enemy_Y_Position,x
      clc                         
      adc #$04
      sta Enemy_Y_Position,x
      lda Enemy_X_Position,x
      clc                         
      adc #$04
      sta Enemy_X_Position,x
      lda Enemy_PageLoc,x
      adc #$00                    
      sta Enemy_PageLoc,x
      jmp TallBBox2               




FlyCCXPositionData:





FlyCCXSpeedData:




FlyCCTimerData:


InitFlyingCheepCheep:
         lda FrenzyEnemyTimer       
         bne ChpChpEx
         jsr SmallBBox              
         lda PseudoRandomBitReg+1,x
         and #%00000011             
         tay
         lda FlyCCTimerData,y       
         sta FrenzyEnemyTimer
         ldy #$03                   
         lda SecondaryHardMode
         beq MaxCC                  
         iny                        
MaxCC:   sty $00                    
         cpx $00                    
         bcs ChpChpEx               
         lda PseudoRandomBitReg,x
         and #%00000011             
         sta $00                    
         sta $01
         lda #$fb                   
         sta Enemy_Y_Speed,x
         lda #$00                   
         ldy Player_X_Speed         
         beq GSeed                  
         lda #$04
         cpy #$19                   
         bcc GSeed                  
         asl                        
GSeed:   pha                        
         clc
         adc $00                    
         sta $00                    
         lda PseudoRandomBitReg+1,x
         and #%00000011             
         beq RSeed                  
         lda PseudoRandomBitReg+2,x
         and #%00001111             
         sta $00                    
RSeed:   pla                        
         clc
         adc $01                    
         tay                        
         lda FlyCCXSpeedData,y      
         sta Enemy_X_Speed,x
         lda #$01                   
         sta Enemy_MovingDir,x
         lda Player_X_Speed         
         bne D2XPos1
         ldy $00                    
         tya                        
         and #%00000010
         beq D2XPos1                
         lda Enemy_X_Speed,x
         eor #$ff                   
         clc                        
         adc #$01                   
         sta Enemy_X_Speed,x
         inc Enemy_MovingDir,x      
D2XPos1: tya                        
         and #%00000010
         beq D2XPos2                
         lda Player_X_Position      
         clc
         adc FlyCCXPositionData,y   
         sta Enemy_X_Position,x     
         lda Player_PageLoc         
         adc #$00                   
         jmp FinCCSt
D2XPos2: lda Player_X_Position      
         sec
         sbc FlyCCXPositionData,y   
         sta Enemy_X_Position,x     
         lda Player_PageLoc         
         sbc #$00                   
FinCCSt: sta Enemy_PageLoc,x        
         lda #$01
         sta Enemy_Flag,x           
         sta Enemy_Y_HighPos,x      
         lda #$f8
         sta Enemy_Y_Position,x     
         rts



InitBowser:
      jsr DuplicateEnemyObj     
      stx BowserFront_Offset    
      lda #$00
      sta BowserBodyControls    
      sta BridgeCollapseOffset  
      lda Enemy_X_Position,x
      sta BowserOrigXPos        
      lda #$df
      sta BowserFireBreathTimer 
      sta Enemy_MovingDir,x     
      lda #$20
      sta BowserFeetCounter     
      sta EnemyFrameTimer,x
      lda #$05
      sta BowserHitPoints       
      lsr
      sta BowserMovementSpeed   
      rts



DuplicateEnemyObj:
        ldy #$ff                
FSLoop: iny                     
        lda Enemy_Flag,y        
        bne FSLoop              
        sty DuplicateObj_Offset 
        txa                     
        ora #%10000000          
        sta Enemy_Flag,y        
        lda Enemy_PageLoc,x
        sta Enemy_PageLoc,y     
        lda Enemy_X_Position,x  
        sta Enemy_X_Position,y
        lda #$01
        sta Enemy_Flag,x        
        sta Enemy_Y_HighPos,y   
        lda Enemy_Y_Position,x
        sta Enemy_Y_Position,y  
FlmEx:  rts                     



FlameYPosData:


FlameYMFAdderData:


InitBowserFlame:
        lda FrenzyEnemyTimer        
        bne FlmEx
        sta Enemy_Y_MoveForce,x     
        lda NoiseSoundQueue
        ora #Sfx_BowserFlame        
        sta NoiseSoundQueue
        ldy BowserFront_Offset      
        lda Enemy_ID,y              
        cmp #Bowser
        beq SpawnFromMouth          
        jsr SetFlameTimer           
        clc
        adc #$20                    
        ldy SecondaryHardMode
        beq SetFrT                  
        sec
        sbc #$10                    
SetFrT: sta FrenzyEnemyTimer        
        lda PseudoRandomBitReg,x
        and #%00000011              
        sta BowserFlamePRandomOfs,x 
        tay                         
        lda FlameYPosData,y         

PutAtRightExtent:
      sta Enemy_Y_Position,x    
      lda ScreenRight_X_Pos
      clc
      adc #$20                  
      sta Enemy_X_Position,x
      lda ScreenRight_PageLoc
      adc #$00                  
      sta Enemy_PageLoc,x
      jmp FinishFlame           

SpawnFromMouth:
       lda Enemy_X_Position,y    
       sec
       sbc #$0e                  
       sta Enemy_X_Position,x    
       lda Enemy_PageLoc,y
       sta Enemy_PageLoc,x       
       lda Enemy_Y_Position,y
       clc                       
       adc #$08
       sta Enemy_Y_Position,x    
       lda PseudoRandomBitReg,x
       and #%00000011            
       sta Enemy_YMF_Dummy,x     
       tay                       
       lda FlameYPosData,y       
       ldy #$00                  
       cmp Enemy_Y_Position,x    
       bcc SetMF                 
       iny                       
SetMF: lda FlameYMFAdderData,y   
       sta Enemy_Y_MoveForce,x   
       lda #$00
       sta EnemyFrenzyBuffer     

FinishFlame:
      lda #$08                 
      sta Enemy_BoundBoxCtrl,x
      lda #$01                 
      sta Enemy_Y_HighPos,x    
      sta Enemy_Flag,x
      lsr
      sta Enemy_X_MoveForce,x  
      sta Enemy_State,x        
      rts



FireworksXPosData:


FireworksYPosData:


InitFireworks:
          lda FrenzyEnemyTimer         
          bne ExitFWk
          lda #$20                     
          sta FrenzyEnemyTimer
          dec FireworksCounter         
          ldy #$06                     
StarFChk: dey
          lda Enemy_ID,y               
          cmp #StarFlagObject          
          bne StarFChk                 
          lda Enemy_X_Position,y
          sec                          
          sbc #$30                     
          pha                          
          lda Enemy_PageLoc,y
          sbc #$00                     
          sta $00                      
          lda FireworksCounter         
          clc
          adc Enemy_State,y            
          tay                          
          pla                          
          clc
          adc FireworksXPosData,y      
          sta Enemy_X_Position,x       
          lda $00
          adc #$00                     
          sta Enemy_PageLoc,x          
          lda FireworksYPosData,y      
          sta Enemy_Y_Position,x       
          lda #$01
          sta Enemy_Y_HighPos,x        
          sta Enemy_Flag,x             
          lsr
          sta ExplosionGfxCounter,x    
          lda #$08
          sta ExplosionTimerCounter,x  
ExitFWk:  rts



Bitmasks:


Enemy17YPosData:


SwimCC_IDData:


BulletBillCheepCheep:
         lda FrenzyEnemyTimer      
         bne ExF17
         lda AreaType              
         bne DoBulletBills         
         cpx #$03                  
         bcs ExF17                 
         ldy #$00                  
         lda PseudoRandomBitReg,x
         cmp #$aa                  
         bcc ChkW2                 
         iny                       
ChkW2:   lda WorldNumber           
         cmp #World2
         beq Get17ID               
         iny                       
Get17ID: tya
         and #%00000001            
         tay
         lda SwimCC_IDData,y       
Set17ID: sta Enemy_ID,x            
         lda BitMFilter
         cmp #$ff                  
         bne GetRBit
         lda #$00                  
         sta BitMFilter
GetRBit: lda PseudoRandomBitReg,x  
         and #%00000111            
ChkRBit: tay                       
         lda Bitmasks,y            
         bit BitMFilter            
         beq AddFBit
         iny                       
         tya
         and #%00000111            
         jmp ChkRBit               
AddFBit: ora BitMFilter            
         sta BitMFilter            
         lda Enemy17YPosData,y     
         jsr PutAtRightExtent      
         sta Enemy_YMF_Dummy,x     
         lda #$20                  
         sta FrenzyEnemyTimer
         jmp CheckpointEnemyID     

DoBulletBills:
          ldy #$ff                   
BB_SLoop: iny                        
          cpy #$05                   
          bcs FireBulletBill
          lda Enemy_Flag,y           
          beq BB_SLoop               
          lda Enemy_ID,y
          cmp #BulletBill_FrenzyVar  
          bne BB_SLoop               
ExF17:    rts                        

FireBulletBill:
      lda Square2SoundQueue
      ora #Sfx_Blast            
      sta Square2SoundQueue
      lda #BulletBill_FrenzyVar 
      bne Set17ID               







HandleGroupEnemies:
        ldy #$00                  
        sec
        sbc #$37                  
        pha                       
        cmp #$04                  
        bcs SnglID                
        pha                       
        ldy #Goomba               
        lda PrimaryHardMode       
        beq PullID                
        ldy #BuzzyBeetle          
PullID: pla                       
SnglID: sty $01                   
        ldy #$b0                  
        and #$02                  
        beq SetYGp                
        ldy #$70                  
SetYGp: sty $00                   
        lda ScreenRight_PageLoc   
        sta $02                   
        lda ScreenRight_X_Pos     
        sta $03                   
        ldy #$02                  
        pla                       
        lsr                       
        bcc CntGrp                
        iny                       
CntGrp: sty NumberofGroupEnemies  
GrLoop: ldx #$ff                  
GSltLp: inx                       
        cpx #$05                  
        bcs NextED
        lda Enemy_Flag,x          
        bne GSltLp                
        lda $01
        sta Enemy_ID,x            
        lda $02
        sta Enemy_PageLoc,x       
        lda $03
        sta Enemy_X_Position,x    
        clc
        adc #$18                  
        sta $03
        lda $02                   
        adc #$00                  
        sta $02
        lda $00                   
        sta Enemy_Y_Position,x
        lda #$01                  
        sta Enemy_Y_HighPos,x     
        sta Enemy_Flag,x
        jsr CheckpointEnemyID     
        dec NumberofGroupEnemies  
        bne GrLoop
NextED: jmp Inc2B                 



InitPiranhaPlant:
      lda #$01                     
      sta PiranhaPlant_Y_Speed,x
      lsr
      sta Enemy_State,x            
      sta PiranhaPlant_MoveFlag,x  
      lda Enemy_Y_Position,x
      sta PiranhaPlantDownYPos,x   
      sec
      sbc #$18
      sta PiranhaPlantUpYPos,x     
      lda #$09
      jmp SetBBox2                 



InitEnemyFrenzy:
      lda Enemy_ID,x        
      sta EnemyFrenzyBuffer 
      sec
      sbc #$12              
      jsr JumpEngine


NoFrenzyCode:
      rts



EndFrenzy:
           ldy #$05               
LakituChk: lda Enemy_ID,y         
           cmp #Lakitu            
           bne NextFSlot
           lda #$01               
           sta Enemy_State,y
NextFSlot: dey                    
           bpl LakituChk          
           lda #$00
           sta EnemyFrenzyBuffer  
           sta Enemy_Flag,x       
           rts



InitJumpGPTroopa:
           lda #$02                  
           sta Enemy_MovingDir,x
           lda #$f8                  
           sta Enemy_X_Speed,x
TallBBox2: lda #$03                  
SetBBox2:  sta Enemy_BoundBoxCtrl,x  
           rts



InitBalPlatform:
        dec Enemy_Y_Position,x    
        dec Enemy_Y_Position,x
        ldy SecondaryHardMode     
        bne AlignP                
        ldy #$02                  
        jsr PosPlatform           
AlignP: ldy #$ff                  
        lda BalPlatformAlignment  
        sta Enemy_State,x         
        bpl SetBPA                
        txa                       
        tay                       
SetBPA: sty BalPlatformAlignment  
        lda #$00
        sta Enemy_MovingDir,x     
        tay                       
        jsr PosPlatform           



InitDropPlatform:
      lda #$ff
      sta PlatformCollisionFlag,x  
      jmp CommonPlatCode           



InitHoriPlatform:
      lda #$00
      sta XMoveSecondaryCounter,x  
      jmp CommonPlatCode           



InitVertPlatform:
       ldy #$40                    
       lda Enemy_Y_Position,x      
       bpl SetYO                   
       eor #$ff
       clc                         
       adc #$01
       ldy #$c0                    
SetYO: sta YPlatformTopYPos,x      
       tya
       clc                         
       adc Enemy_Y_Position,x      
       sta YPlatformCenterYPos,x   



CommonPlatCode: 
        jsr InitVStf              
SPBBox: lda #$05                  
        ldy AreaType
        cpy #$03                  
        beq CasPBB                
        ldy SecondaryHardMode     
        bne CasPBB                
        lda #$06                  
CasPBB: sta Enemy_BoundBoxCtrl,x  
        rts



LargeLiftUp:
      jsr PlatLiftUp       
      jmp LargeLiftBBox    

LargeLiftDown:
      jsr PlatLiftDown     

LargeLiftBBox:
      jmp SPBBox           



PlatLiftUp:
      lda #$10                 
      sta Enemy_Y_MoveForce,x
      lda #$ff                 
      sta Enemy_Y_Speed,x
      jmp CommonSmallLift      



PlatLiftDown:
      lda #$f0                 
      sta Enemy_Y_MoveForce,x
      lda #$00                 
      sta Enemy_Y_Speed,x



CommonSmallLift:
      ldy #$01
      jsr PosPlatform           
      lda #$04
      sta Enemy_BoundBoxCtrl,x  
      rts



PlatPosDataLow:


PlatPosDataHigh:


PosPlatform:
      lda Enemy_X_Position,x  
      clc
      adc PlatPosDataLow,y    
      sta Enemy_X_Position,x  
      lda Enemy_PageLoc,x
      adc PlatPosDataHigh,y   
      sta Enemy_PageLoc,x     
      rts                     



EndOfEnemyInitCode:
      rts



RunEnemyObjectsCore:
       ldx ObjectOffset  
       lda #$00          
       ldy Enemy_ID,x
       cpy #$15          
       bcc JmpEO
       tya               
       sbc #$14          
JmpEO: jsr JumpEngine





































NoRunCode:
      rts



RunRetainerObj:
      jsr GetEnemyOffscreenBits
      jsr RelativeEnemyPosition
      jmp EnemyGfxHandler



RunNormalEnemies:
          lda #$00                  
          sta Enemy_SprAttrib,x
          jsr GetEnemyOffscreenBits
          jsr RelativeEnemyPosition
          jsr EnemyGfxHandler
          jsr GetEnemyBoundBox
          jsr EnemyToBGCollisionDet
          jsr EnemiesCollision
          jsr PlayerEnemyCollision
          ldy TimerControl          
          bne SkipMove
          jsr EnemyMovementSubs
SkipMove: jmp OffscreenBoundsCheck

EnemyMovementSubs:
      lda Enemy_ID,x
      jsr JumpEngine
























NoMoveCode:
      rts



RunBowserFlame:
      jsr ProcBowserFlame
      jsr GetEnemyOffscreenBits
      jsr RelativeEnemyPosition
      jsr GetEnemyBoundBox
      jsr PlayerEnemyCollision
      jmp OffscreenBoundsCheck



RunFirebarObj:
      jsr ProcFirebar
      jmp OffscreenBoundsCheck



RunSmallPlatform:
      jsr GetEnemyOffscreenBits
      jsr RelativeEnemyPosition
      jsr SmallPlatformBoundBox
      jsr SmallPlatformCollision
      jsr RelativeEnemyPosition
      jsr DrawSmallPlatform
      jsr MoveSmallPlatform
      jmp OffscreenBoundsCheck



RunLargePlatform:
        jsr GetEnemyOffscreenBits
        jsr RelativeEnemyPosition
        jsr LargePlatformBoundBox
        jsr LargePlatformCollision
        lda TimerControl             
        bne SkipPT                   
        jsr LargePlatformSubroutines
SkipPT: jsr RelativeEnemyPosition
        jsr DrawLargePlatform
        jmp OffscreenBoundsCheck



LargePlatformSubroutines:
      lda Enemy_ID,x  
      sec
      sbc #$24
      jsr JumpEngine










EraseEnemyObject:
      lda #$00                 
      sta Enemy_Flag,x
      sta Enemy_ID,x
      sta Enemy_State,x
      sta FloateyNum_Control,x
      sta EnemyIntervalTimer,x
      sta ShellChainCounter,x
      sta Enemy_SprAttrib,x
      sta EnemyFrameTimer,x
      rts



MovePodoboo:
      lda EnemyIntervalTimer,x   
      bne PdbM                   
      jsr InitPodoboo            
      lda PseudoRandomBitReg+1,x 
      ora #%10000000             
      sta Enemy_Y_MoveForce,x    
      and #%00001111             
      ora #$06                   
      sta EnemyIntervalTimer,x   
      lda #$f9
      sta Enemy_Y_Speed,x        
PdbM: jmp MoveJ_EnemyVertically  




HammerThrowTmrData:


XSpeedAdderData:


RevivedXSpeed:


ProcHammerBro:
       lda Enemy_State,x          
       and #%00100000
       beq ChkJH                  
       jmp MoveDefeatedEnemy      
ChkJH: lda HammerBroJumpTimer,x   
       beq HammerBroJumpCode      
       dec HammerBroJumpTimer,x   
       lda Enemy_OffscreenBits
       and #%00001100             
       bne MoveHammerBroXDir      
       lda HammerThrowingTimer,x  
       bne DecHT                  
       ldy SecondaryHardMode      
       lda HammerThrowTmrData,y   
       sta HammerThrowingTimer,x  
       jsr SpawnHammerObj         
       bcc DecHT                  
       lda Enemy_State,x
       ora #%00001000             
       sta Enemy_State,x
       jmp MoveHammerBroXDir      
DecHT: dec HammerThrowingTimer,x  
       jmp MoveHammerBroXDir      

HammerBroJumpLData:


HammerBroJumpCode:
       lda Enemy_State,x           
       and #%00000111              
       cmp #$01                    
       beq MoveHammerBroXDir       
       lda #$00                    
       sta $00                     
       ldy #$fa                    
       lda Enemy_Y_Position,x      
       bmi SetHJ                   
       ldy #$fd                    
       cmp #$70                    
       inc $00                     
       bcc SetHJ                   
       dec $00                     
       lda PseudoRandomBitReg+1,x  
       and #$01
       bne SetHJ                   
       ldy #$fa                    
SetHJ: sty Enemy_Y_Speed,x         
       lda Enemy_State,x           
       ora #$01
       sta Enemy_State,x
       lda $00                     
       and PseudoRandomBitReg+2,x  
       tay                         
       lda SecondaryHardMode       
       bne HJump
       tay                         
HJump: lda HammerBroJumpLData,y    
       sta EnemyFrameTimer,x       
       lda PseudoRandomBitReg+1,x
       ora #%11000000              
       sta HammerBroJumpTimer,x    

MoveHammerBroXDir:
         ldy #$fc                  
         lda FrameCounter
         and #%01000000            
         bne Shimmy
         ldy #$04                  
Shimmy:  sty Enemy_X_Speed,x       
         ldy #$01                  
         jsr PlayerEnemyDiff       
         bmi SetShim               
         iny                       
         lda EnemyIntervalTimer,x  
         bne SetShim               
         lda #$f8
         sta Enemy_X_Speed,x       
SetShim: sty Enemy_MovingDir,x     

MoveNormalEnemy:
       ldy #$00                   
       lda Enemy_State,x
       and #%01000000             
       bne FallE                  
       lda Enemy_State,x
       asl                        
       bcs SteadM                 
       lda Enemy_State,x
       and #%00100000             
       bne MoveDefeatedEnemy      
       lda Enemy_State,x
       and #%00000111             
       beq SteadM                 
       cmp #$05
       beq FallE                  
       cmp #$03
       bcs ReviveStunned          
FallE: jsr MoveD_EnemyVertically  
       ldy #$00
       lda Enemy_State,x          
       cmp #$02
       beq MEHor                  
       and #%01000000             
       beq SteadM                 
       lda Enemy_ID,x
       cmp #PowerUpObject         
       beq SteadM
       bne SlowM                  
MEHor: jmp MoveEnemyHorizontally  

SlowM:  ldy #$01                  
SteadM: lda Enemy_X_Speed,x       
        pha                       
        bpl AddHS                 
        iny
        iny                       
AddHS:  clc
        adc XSpeedAdderData,y     
        sta Enemy_X_Speed,x       
        jsr MoveEnemyHorizontally 
        pla
        sta Enemy_X_Speed,x       
        rts                       

ReviveStunned:
         lda EnemyIntervalTimer,x  
         bne ChkKillGoomba         
         sta Enemy_State,x         
         lda FrameCounter
         and #$01                  
         tay                       
         iny
         sty Enemy_MovingDir,x     
         dey                       
         lda PrimaryHardMode       
         beq SetRSpd               
         iny
         iny                       
SetRSpd: lda RevivedXSpeed,y       
         sta Enemy_X_Speed,x       
         rts

MoveDefeatedEnemy:
      jsr MoveD_EnemyVertically      
      jmp MoveEnemyHorizontally      

ChkKillGoomba:
        cmp #$0e              
        bne NKGmba            
        lda Enemy_ID,x
        cmp #Goomba           
        bne NKGmba            
        jsr EraseEnemyObject  
NKGmba: rts                   



MoveJumpingEnemy:
      jsr MoveJ_EnemyVertically  
      jmp MoveEnemyHorizontally  



ProcMoveRedPTroopa:
          lda Enemy_Y_Speed,x
          ora Enemy_Y_MoveForce,x     
          bne MoveRedPTUpOrDown       
          sta Enemy_YMF_Dummy,x       
          lda Enemy_Y_Position,x      
          cmp RedPTroopaOrigXPos,x
          bcs MoveRedPTUpOrDown       
          lda FrameCounter            
          and #%00000111              
          bne NoIncPT                 
          inc Enemy_Y_Position,x      
NoIncPT:  rts                         

MoveRedPTUpOrDown:
          lda Enemy_Y_Position,x      
          cmp RedPTroopaCenterYPos,x
          bcc MovPTDwn                
          jmp MoveRedPTroopaUp        
MovPTDwn: jmp MoveRedPTroopaDown      





MoveFlyGreenPTroopa:
        jsr XMoveCntr_GreenPTroopa 
        jsr MoveWithXMCntrs        
        ldy #$01                   
        lda FrameCounter
        and #%00000011             
        bne NoMGPT                 
        lda FrameCounter
        and #%01000000             
        bne YSway                  
        ldy #$ff                   
YSway:  sty $00                    
        lda Enemy_Y_Position,x
        clc                        
        adc $00                    
        sta Enemy_Y_Position,x
NoMGPT: rts                        

XMoveCntr_GreenPTroopa:
         lda #$13                    

XMoveCntr_Platform:
         sta $01                     
         lda FrameCounter
         and #%00000011              
         bne NoIncXM                 
         ldy XMoveSecondaryCounter,x 
         lda XMovePrimaryCounter,x   
         lsr
         bcs DecSeXM                 
         cpy $01                     
         beq IncPXM                  
         inc XMoveSecondaryCounter,x 
NoIncXM: rts
IncPXM:  inc XMovePrimaryCounter,x   
         rts
DecSeXM: tya                         
         beq IncPXM                  
         dec XMoveSecondaryCounter,x 
         rts

MoveWithXMCntrs:
         lda XMoveSecondaryCounter,x  
         pha
         ldy #$01                     
         lda XMovePrimaryCounter,x
         and #%00000010               
         bne XMRight                  
         lda XMoveSecondaryCounter,x
         eor #$ff                     
         clc                          
         adc #$01
         sta XMoveSecondaryCounter,x
         ldy #$02                     
XMRight: sty Enemy_MovingDir,x        
         jsr MoveEnemyHorizontally
         sta $00                      
         pla                          
         sta XMoveSecondaryCounter,x  
         rts



BlooberBitmasks:


MoveBloober:
        lda Enemy_State,x
        and #%00100000             
        bne MoveDefeatedBloober    
        ldy SecondaryHardMode      
        lda PseudoRandomBitReg+1,x 
        and BlooberBitmasks,y      
        bne BlooberSwim            
        txa
        lsr                        
        bcc FBLeft                 
        ldy Player_MovingDir       
        bcs SBMDir                 
FBLeft: ldy #$02                   
        jsr PlayerEnemyDiff        
        bpl SBMDir                 
        dey                        
SBMDir: sty Enemy_MovingDir,x      

BlooberSwim:
       jsr ProcSwimmingB        
       lda Enemy_Y_Position,x   
       sec
       sbc Enemy_Y_MoveForce,x  
       cmp #$20                 
       bcc SwimX                
       sta Enemy_Y_Position,x   
SwimX: ldy Enemy_MovingDir,x    
       dey
       bne LeftSwim             
       lda Enemy_X_Position,x
       clc                      
       adc BlooperMoveSpeed,x
       sta Enemy_X_Position,x   
       lda Enemy_PageLoc,x
       adc #$00                 
       sta Enemy_PageLoc,x      
       rts

LeftSwim:
      lda Enemy_X_Position,x
      sec                      
      sbc BlooperMoveSpeed,x
      sta Enemy_X_Position,x   
      lda Enemy_PageLoc,x
      sbc #$00                 
      sta Enemy_PageLoc,x      
      rts

MoveDefeatedBloober:
      jmp MoveEnemySlowVert    

ProcSwimmingB:
        lda BlooperMoveCounter,x  
        and #%00000010            
        bne ChkForFloatdown       
        lda FrameCounter
        and #%00000111            
        pha                       
        lda BlooperMoveCounter,x  
        lsr                       
        bcs SlowSwim              
        pla                       
        bne BSwimE                
        lda Enemy_Y_MoveForce,x
        clc                       
        adc #$01
        sta Enemy_Y_MoveForce,x   
        sta BlooperMoveSpeed,x    
        cmp #$02
        bne BSwimE                
        inc BlooperMoveCounter,x  
BSwimE: rts

SlowSwim:
       pla                      
       bne NoSSw                
       lda Enemy_Y_MoveForce,x
       sec                      
       sbc #$01
       sta Enemy_Y_MoveForce,x  
       sta BlooperMoveSpeed,x   
       bne NoSSw                
       inc BlooperMoveCounter,x 
       lda #$02
       sta EnemyIntervalTimer,x 
NoSSw: rts                      

ChkForFloatdown:
      lda EnemyIntervalTimer,x 
      beq ChkNearPlayer        

Floatdown:
      lda FrameCounter        
      lsr                     
      bcs NoFD                
      inc Enemy_Y_Position,x  
NoFD: rts                     

ChkNearPlayer:
      lda Enemy_Y_Position,x    
      adc #$10                  
      cmp Player_Y_Position     
      bcc Floatdown             
      lda #$00
      sta BlooperMoveCounter,x  
      rts



MoveBulletBill:
         lda Enemy_State,x          
         and #%00100000
         beq NotDefB                
         jmp MoveJ_EnemyVertically  
NotDefB: lda #$e8                   
         sta Enemy_X_Speed,x        
         jmp MoveEnemyHorizontally  





SwimCCXMoveData:



MoveSwimmingCheepCheep:
        lda Enemy_State,x         
        and #%00100000            
        beq CCSwim                
        jmp MoveEnemySlowVert     
CCSwim: sta $03                   
        lda Enemy_ID,x            
        sec
        sbc #$0a                  
        tay                       
        lda SwimCCXMoveData,y     
        sta $02
        lda Enemy_X_MoveForce,x   
        sec
        sbc $02                   
        sta Enemy_X_MoveForce,x   
        lda Enemy_X_Position,x    
        sbc #$00                  
        sta Enemy_X_Position,x    
        lda Enemy_PageLoc,x
        sbc #$00                  
        sta Enemy_PageLoc,x       
        lda #$20
        sta $02                   
        cpx #$02                  
        bcc ExSwCC                
        lda CheepCheepMoveMFlag,x 
        cmp #$10                  
        bcc CCSwimUpwards         
        lda Enemy_YMF_Dummy,x
        clc
        adc $02                   
        sta Enemy_YMF_Dummy,x     
        lda Enemy_Y_Position,x    
        adc $03                   
        sta Enemy_Y_Position,x    
        lda Enemy_Y_HighPos,x
        adc #$00                  
        jmp ChkSwimYPos           

CCSwimUpwards:
        lda Enemy_YMF_Dummy,x
        sec
        sbc $02                   
        sta Enemy_YMF_Dummy,x     
        lda Enemy_Y_Position,x    
        sbc $03                   
        sta Enemy_Y_Position,x    
        lda Enemy_Y_HighPos,x
        sbc #$00                  

ChkSwimYPos:
        sta Enemy_Y_HighPos,x     
        ldy #$00                  
        lda Enemy_Y_Position,x    
        sec
        sbc CheepCheepOrigYPos,x  
        bpl YPDiff                
        ldy #$10                  
        eor #$ff
        clc                       
        adc #$01                  
YPDiff: cmp #$0f                  
        bcc ExSwCC                
        tya
        sta CheepCheepMoveMFlag,x 
ExSwCC: rts                       
















FirebarPosLookupTbl:












FirebarMirrorData:


FirebarTblOffsets:



FirebarYPos:


ProcFirebar:
          jsr GetEnemyOffscreenBits   
          lda Enemy_OffscreenBits     
          and #%00001000              
          bne SkipFBar
          lda TimerControl            
          bne SusFbar                 
          lda FirebarSpinSpeed,x      
          jsr FirebarSpin             
          and #%00011111              
          sta FirebarSpinState_High,x 
SusFbar:  lda FirebarSpinState_High,x 
          ldy Enemy_ID,x              
          cpy #$1f
          bcc SetupGFB                
          cmp #$08                    
          beq SkpFSte                 
          cmp #$18
          bne SetupGFB                
SkpFSte:  clc
          adc #$01                    
          sta FirebarSpinState_High,x
SetupGFB: sta $ef                     
          jsr RelativeEnemyPosition   
          jsr GetFirebarPosition      
          ldy Enemy_SprDataOffset,x   
          lda Enemy_Rel_YPos          
          sta Sprite_Y_Position,y     
          sta $07                     
          lda Enemy_Rel_XPos          
          sta Sprite_X_Position,y     
          sta $06                     
          lda #$01
          sta $00                     
          jsr FirebarCollision        
          ldy #$05                    
          lda Enemy_ID,x
          cmp #$1f                    
          bcc SetMFbar                
          ldy #$0b                    
SetMFbar: sty $ed                     
          lda #$00
          sta $00                     
DrawFbar: lda $ef                     
          jsr GetFirebarPosition      
          jsr DrawFirebar_Collision   
          lda $00                     
          cmp #$04
          bne NextFbar
          ldy DuplicateObj_Offset     
          lda Enemy_SprDataOffset,y   
          sta $06                     
NextFbar: inc $00                     
          lda $00
          cmp $ed                     
          bcc DrawFbar                
SkipFBar: rts

DrawFirebar_Collision:
         lda $03                  
         sta $05          
         ldy $06                  
         lda $01                  
         lsr $05                  
         bcs AddHA                
         eor #$ff
         adc #$01                 
AddHA:   clc                      
         adc Enemy_Rel_XPos       
         sta Sprite_X_Position,y  
         sta $06                  
         cmp Enemy_Rel_XPos       
         bcs SubtR1               
         lda Enemy_Rel_XPos
         sec                      
         sbc $06                  
         jmp ChkFOfs
SubtR1:  sec                      
         sbc Enemy_Rel_XPos       
ChkFOfs: cmp #$59                 
         bcc VAHandl              
         lda #$f8                 
         bne SetVFbr              
VAHandl: lda Enemy_Rel_YPos       
         cmp #$f8                 
         beq SetVFbr
         lda $02                  
         lsr $05                  
         bcs AddVA                
         eor #$ff
         adc #$01                 
AddVA:   clc                      
         adc Enemy_Rel_YPos       
SetVFbr: sta Sprite_Y_Position,y  
         sta $07                  

FirebarCollision:
         jsr DrawFirebar          
         tya                      
         pha                      
         lda StarInvincibleTimer  
         ora TimerControl         
         bne NoColFB              
         sta $05                  
         ldy Player_Y_HighPos
         dey                      
         bne NoColFB              
         ldy Player_Y_Position    
         lda PlayerSize           
         bne AdjSm                
         lda CrouchingFlag
         beq BigJp                
AdjSm:   inc $05                  
         inc $05                  
         tya
         clc                      
         adc #$18                 
         tay
BigJp:   tya                      
FBCLoop: sec                      
         sbc $07                  
         bpl ChkVFBD              
         eor #$ff                 
         clc                      
         adc #$01
ChkVFBD: cmp #$08                 
         bcs Chk2Ofs
         lda $06                  
         cmp #$f0                 
         bcs Chk2Ofs
         lda Sprite_X_Position+4  
         clc
         adc #$04                 
         sta $04                  
         sec                      
         sbc $06                  
         bpl ChkFBCl              
         eor #$ff                 
         clc                      
         adc #$01
ChkFBCl: cmp #$08                 
         bcc ChgSDir              
Chk2Ofs: lda $05                  
         cmp #$02                 
         beq NoColFB
         ldy $05                  
         lda Player_Y_Position
         clc
         adc FirebarYPos,y        
         inc $05                  
         jmp FBCLoop
ChgSDir: ldx #$01                 
         lda $04                  
         cmp $06                  
         bcs SetSDir              
         inx                      
SetSDir: stx Enemy_MovingDir      
         ldx #$00
         lda $00                  
         pha
         jsr InjurePlayer         
         pla
         sta $00                  
NoColFB: pla                      
         clc                      
         adc #$04
         sta $06
         ldx ObjectOffset         
         rts

GetFirebarPosition:
           pha                        
           and #%00001111             
           cmp #$09
           bcc GetHAdder              
           eor #%00001111             
           clc
           adc #$01
GetHAdder: sta $01                    
           ldy $00                    
           lda FirebarTblOffsets,y    
           clc
           adc $01                    
           tay                        
           lda FirebarPosLookupTbl,y  
           sta $01
           pla                        
           pha                        
           clc
           adc #$08                   
           and #%00001111             
           cmp #$09                   
           bcc GetVAdder
           eor #%00001111             
           clc
           adc #$01
GetVAdder: sta $02                    
           ldy $00
           lda FirebarTblOffsets,y    
           clc
           adc $02                    
           tay
           lda FirebarPosLookupTbl,y  
           sta $02
           pla                        
           lsr                        
           lsr
           lsr
           tay                        
           lda FirebarMirrorData,y    
           sta $03                    
           rts



PRandomSubtracter:


FlyCCBPriority:


MoveFlyingCheepCheep:
        lda Enemy_State,x          
        and #%00100000             
        beq FlyCC                  
        lda #$00
        sta Enemy_SprAttrib,x      
        jmp MoveJ_EnemyVertically  
FlyCC:  jsr MoveEnemyHorizontally  
        ldy #$0d                   
        lda #$05                   
        jsr SetXMoveAmt            
        lda Enemy_Y_MoveForce,x
        lsr                        
        lsr                        
        lsr
        lsr
        tay                        
        lda Enemy_Y_Position,x     
        sec                        
        sbc PRandomSubtracter,y
        bpl AddCCF                  
        eor #$ff
        clc                        
        adc #$01
AddCCF: cmp #$08                   
        bcs BPGet                  
        lda Enemy_Y_MoveForce,x
        clc
        adc #$10                   
        sta Enemy_Y_MoveForce,x
        lsr                        
        lsr
        lsr
        lsr
        tay
BPGet:  lda FlyCCBPriority,y       
        sta Enemy_SprAttrib,x      
        rts                        





LakituDiffAdj:


MoveLakitu:
         lda Enemy_State,x          
         and #%00100000             
         beq ChkLS                  
         jmp MoveD_EnemyVertically  
ChkLS:   lda Enemy_State,x          
         beq Fr12S                  
         lda #$00
         sta LakituMoveDirection,x  
         sta EnemyFrenzyBuffer      
         lda #$10
         bne SetLSpd                
Fr12S:   lda #Spiny
         sta EnemyFrenzyBuffer      
         ldy #$02
LdLDa:   lda LakituDiffAdj,y        
         sta $0001,y                
         dey
         bpl LdLDa                  
         jsr PlayerLakituDiff       
SetLSpd: sta LakituMoveSpeed,x      
         ldy #$01                   
         lda LakituMoveDirection,x
         and #$01                   
         bne SetLMov                
         lda LakituMoveSpeed,x
         eor #$ff                   
         clc
         adc #$01
         sta LakituMoveSpeed,x      
         iny                        
SetLMov: sty Enemy_MovingDir,x      
         jmp MoveEnemyHorizontally  

PlayerLakituDiff:
           ldy #$00                   
           jsr PlayerEnemyDiff        
           bpl ChkLakDif              
           iny                        
           lda $00
           eor #$ff                   
           clc
           adc #$01                   
           sta $00
ChkLakDif: lda $00                    
           cmp #$3c                   
           bcc ChkPSpeed
           lda #$3c                   
           sta $00
           lda Enemy_ID,x             
           cmp #Lakitu
           bne ChkPSpeed              
           tya                        
           cmp LakituMoveDirection,x  
           beq ChkPSpeed              
           lda LakituMoveDirection,x  
           beq SetLMovD               
           dec LakituMoveSpeed,x      
           lda LakituMoveSpeed,x      
           bne ExMoveLak
SetLMovD:  tya                        
           sta LakituMoveDirection,x  
ChkPSpeed: lda $00
           and #%00111100             
           lsr                        
           lsr
           sta $00                    
           ldy #$00                   
           lda Player_X_Speed
           beq SubDifAdj              
           lda ScrollAmount
           beq SubDifAdj              
           iny                        
           lda Player_X_Speed
           cmp #$19                   
           bcc ChkSpinyO
           lda ScrollAmount
           cmp #$02                   
           bcc ChkSpinyO              
           iny                        
ChkSpinyO: lda Enemy_ID,x             
           cmp #Spiny
           bne ChkEmySpd              
           lda Player_X_Speed         
           bne SubDifAdj
ChkEmySpd: lda Enemy_Y_Speed,x        
           bne SubDifAdj              
           ldy #$00                   
SubDifAdj: lda $0001,y                
           ldy $00                    
SPixelLak: sec                        
           sbc #$01                   
           dey
           bpl SPixelLak              
ExMoveLak: rts                        




BridgeCollapseData:





BridgeCollapse:
       ldx BowserFront_Offset    
       lda Enemy_ID,x            
       cmp #Bowser               
       bne SetM2                 
       stx ObjectOffset          
       lda Enemy_State,x         
       beq RemoveBridge
       and #%01000000            
       beq SetM2
       lda Enemy_Y_Position,x    
       cmp #$e0                  
       bcc MoveD_Bowser
SetM2: lda #Silence              
       sta EventMusicQueue
       inc OperMode_Task         
       jmp KillAllEnemies        

MoveD_Bowser:
       jsr MoveEnemySlowVert     
       jmp BowserGfxHandler      

RemoveBridge:
         dec BowserFeetCounter     
         bne NoBFall               
         lda #$04
         sta BowserFeetCounter     
         lda BowserBodyControls
         eor #$01                  
         sta BowserBodyControls
         lda #$22                  
         sta $05
         ldy BridgeCollapseOffset  
         lda BridgeCollapseData,y  
         sta $04
         ldy VRAM_Buffer1_Offset   
         iny
         ldx #$0c                  
         jsr RemBridge             
         ldx ObjectOffset          
         jsr MoveVOffset           
         lda #Sfx_Blast            
         sta Square2SoundQueue     
         lda #Sfx_BrickShatter     
         sta NoiseSoundQueue       
         inc BridgeCollapseOffset  
         lda BridgeCollapseOffset
         cmp #$0f                  
         bne NoBFall               
         jsr InitVStf              
         lda #%01000000
         sta Enemy_State,x         
         lda #Sfx_BowserFall
         sta Square2SoundQueue     
NoBFall: jmp BowserGfxHandler      



PRandomRange:


RunBowser:
      lda Enemy_State,x       
      and #%00100000          
      beq BowserControl
      lda Enemy_Y_Position,x  
      cmp #$e0                
      bcc MoveD_Bowser        

KillAllEnemies:
          ldx #$04              
KillLoop: jsr EraseEnemyObject  
          dex                   
          bpl KillLoop          
          sta EnemyFrenzyBuffer 
          ldx ObjectOffset      
          rts

BowserControl:
           lda #$00
           sta EnemyFrenzyBuffer      
           lda TimerControl           
           beq ChkMouth               
           jmp SkipToFB               
ChkMouth:  lda BowserBodyControls     
           bpl FeetTmr                
           jmp HammerChk              
FeetTmr:   dec BowserFeetCounter      
           bne ResetMDr               
           lda #$20                   
           sta BowserFeetCounter        
           lda BowserBodyControls     
           eor #%00000001             
           sta BowserBodyControls
ResetMDr:  lda FrameCounter           
           and #%00001111             
           bne B_FaceP                
           lda #$02                   
           sta Enemy_MovingDir,x      
B_FaceP:   lda EnemyFrameTimer,x      
           beq GetPRCmp               
           jsr PlayerEnemyDiff        
           bpl GetPRCmp               
           lda #$01
           sta Enemy_MovingDir,x      
           lda #$02
           sta BowserMovementSpeed    
           lda #$20
           sta EnemyFrameTimer,x      
           sta BowserFireBreathTimer  
           lda Enemy_X_Position,x        
           cmp #$c8                   
           bcs HammerChk              
GetPRCmp:  lda FrameCounter           
           and #%00000011
           bne HammerChk              
           lda Enemy_X_Position,x
           cmp BowserOrigXPos         
           bne GetDToO                
           lda PseudoRandomBitReg,x
           and #%00000011             
           tay
           lda PRandomRange,y         
           sta MaxRangeFromOrigin     
GetDToO:   lda Enemy_X_Position,x
           clc                        
           adc BowserMovementSpeed    
           sta Enemy_X_Position,x
           ldy Enemy_MovingDir,x
           cpy #$01                   
           beq HammerChk
           ldy #$ff                   
           sec                        
           sbc BowserOrigXPos         
           bpl CompDToO               
           eor #$ff
           clc                        
           adc #$01
           ldy #$01                   
CompDToO:  cmp MaxRangeFromOrigin     
           bcc HammerChk              
           sty BowserMovementSpeed    
HammerChk: lda EnemyFrameTimer,x      
           bne MakeBJump              
           jsr MoveEnemySlowVert      
           lda WorldNumber            
           cmp #World6
           bcc SetHmrTmr              
           lda FrameCounter
           and #%00000011             
           bne SetHmrTmr              
           jsr SpawnHammerObj         
SetHmrTmr: lda Enemy_Y_Position,x     
           cmp #$80                   
           bcc ChkFireB               
           lda PseudoRandomBitReg,x
           and #%00000011             
           tay
           lda PRandomRange,y         
           sta EnemyFrameTimer,x      
SkipToFB:  jmp ChkFireB               
MakeBJump: cmp #$01                   
           bne ChkFireB               
           dec Enemy_Y_Position,x     
           jsr InitVStf               
           lda #$fe
           sta Enemy_Y_Speed,x        
ChkFireB:  lda WorldNumber            
           cmp #World8                
           beq SpawnFBr               
           cmp #World6                
           bcs BowserGfxHandler       
SpawnFBr:  lda BowserFireBreathTimer  
           bne BowserGfxHandler       
           lda #$20
           sta BowserFireBreathTimer  
           lda BowserBodyControls
           eor #%10000000             
           sta BowserBodyControls     
           bmi ChkFireB               
           jsr SetFlameTimer          
           ldy SecondaryHardMode
           beq SetFBTmr               
           sec
           sbc #$10                   
SetFBTmr:  sta BowserFireBreathTimer  
           lda #BowserFlame           
           sta EnemyFrenzyBuffer      



BowserGfxHandler:
          jsr ProcessBowserHalf    
          ldy #$10                 
          lda Enemy_MovingDir,x    
          lsr
          bcc CopyFToR             
          ldy #$f0                 
CopyFToR: tya                      
          clc
          adc Enemy_X_Position,x   
          ldy DuplicateObj_Offset  
          sta Enemy_X_Position,y   
          lda Enemy_Y_Position,x
          clc                      
          adc #$08                 
          sta Enemy_Y_Position,y   
          lda Enemy_State,x
          sta Enemy_State,y        
          lda Enemy_MovingDir,x
          sta Enemy_MovingDir,y    
          lda ObjectOffset         
          pha
          ldx DuplicateObj_Offset  
          stx ObjectOffset
          lda #Bowser              
          sta Enemy_ID,x           
          jsr ProcessBowserHalf    
          pla
          sta ObjectOffset         
          tax
          lda #$00                 
          sta BowserGfxFlag
ExBGfxH:  rts                      

ProcessBowserHalf:
      inc BowserGfxFlag         
      jsr RunRetainerObj        
      lda Enemy_State,x
      bne ExBGfxH               
      lda #$0a
      sta Enemy_BoundBoxCtrl,x  
      jsr GetEnemyBoundBox      
      jmp PlayerEnemyCollision  





FlameTimerData:


SetFlameTimer:
      ldy BowserFlameTimerCtrl  
      inc BowserFlameTimerCtrl  
      lda BowserFlameTimerCtrl  
      and #%00000111            
      sta BowserFlameTimerCtrl
      lda FlameTimerData,y      
ExFl: rts

ProcBowserFlame:
         lda TimerControl            
         bne SetGfxF                 
         lda #$40                    
         ldy SecondaryHardMode
         beq SFlmX                   
         lda #$60                    
SFlmX:   sta $00                     
         lda Enemy_X_MoveForce,x
         sec                         
         sbc $00
         sta Enemy_X_MoveForce,x     
         lda Enemy_X_Position,x
         sbc #$01                    
         sta Enemy_X_Position,x      
         lda Enemy_PageLoc,x
         sbc #$00                    
         sta Enemy_PageLoc,x
         ldy BowserFlamePRandomOfs,x 
         lda Enemy_Y_Position,x      
         cmp FlameYPosData,y         
         beq SetGfxF                 
         clc
         adc Enemy_Y_MoveForce,x     
         sta Enemy_Y_Position,x      
SetGfxF: jsr RelativeEnemyPosition   
         lda Enemy_State,x           
         bne ExFl                    
         lda #$51                    
         sta $00                     
         ldy #$02                    
         lda FrameCounter
         and #%00000010              
         beq FlmeAt                  
         ldy #$82                    
FlmeAt:  sty $01                     
         ldy Enemy_SprDataOffset,x   
         ldx #$00

DrawFlameLoop:
         lda Enemy_Rel_YPos         
         sta Sprite_Y_Position,y    
         lda $00
         sta Sprite_Tilenumber,y    
         inc $00                    
         lda $01
         sta Sprite_Attributes,y    
         lda Enemy_Rel_XPos
         sta Sprite_X_Position,y    
         clc
         adc #$08
         sta Enemy_Rel_XPos         
         iny
         iny
         iny
         iny                        
         inx                        
         cpx #$03                   
         bcc DrawFlameLoop
         ldx ObjectOffset           
         jsr GetEnemyOffscreenBits  
         ldy Enemy_SprDataOffset,x  
         lda Enemy_OffscreenBits    
         lsr                        
         pha
         bcc M3FOfs                 
         lda #$f8                   
         sta Sprite_Y_Position+12,y 
M3FOfs:  pla                        
         lsr                        
         pha
         bcc M2FOfs                 
         lda #$f8                   
         sta Sprite_Y_Position+8,y
M2FOfs:  pla                        
         lsr                        
         pha
         bcc M1FOfs                 
         lda #$f8                   
         sta Sprite_Y_Position+4,y
M1FOfs:  pla                        
         lsr                        
         bcc ExFlmeD                
         lda #$f8
         sta Sprite_Y_Position,y    
ExFlmeD: rts                        



RunFireworks:
           dec ExplosionTimerCounter,x 
           bne SetupExpl               
           lda #$08
           sta ExplosionTimerCounter,x 
           inc ExplosionGfxCounter,x   
           lda ExplosionGfxCounter,x
           cmp #$03                    
           bcs FireworksSoundScore     
SetupExpl: jsr RelativeEnemyPosition   
           lda Enemy_Rel_YPos          
           sta Fireball_Rel_YPos       
           lda Enemy_Rel_XPos          
           sta Fireball_Rel_XPos
           ldy Enemy_SprDataOffset,x   
           lda ExplosionGfxCounter,x   
           jsr DrawExplosion_Fireworks 
           rts

FireworksSoundScore:
      lda #$00               
      sta Enemy_Flag,x
      lda #Sfx_Blast         
      sta Square2SoundQueue
      lda #$05               
      sta DigitModifier+4
      jmp EndAreaPoints     



StarFlagYPosAdder:


StarFlagXPosAdder:


StarFlagTileData:


RunStarFlagObj:
      lda #$00                 
      sta EnemyFrenzyBuffer
      lda StarFlagTaskControl  
      cmp #$05                 
      bcs StarFlagExit
      jsr JumpEngine           






GameTimerFireworks:
        ldy #$05               
        lda GameTimerDisplay+2 
        cmp #$01
        beq SetFWC             
        ldy #$03               
        cmp #$03
        beq SetFWC             
        ldy #$00               
        cmp #$06
        beq SetFWC             
        lda #$ff               
SetFWC: sta FireworksCounter   
        sty Enemy_State,x      

IncrementSFTask1:
      inc StarFlagTaskControl  

StarFlagExit:
      rts                      

AwardGameTimerPoints:
         lda GameTimerDisplay   
         ora GameTimerDisplay+1
         ora GameTimerDisplay+2
         beq IncrementSFTask1   
         lda FrameCounter
         and #%00000100         
         beq NoTTick            
         lda #Sfx_TimerTick
         sta Square2SoundQueue  
NoTTick: ldy #$23               
         lda #$ff               
         sta DigitModifier+5    
         jsr DigitsMathRoutine  
         lda #$05               
         sta DigitModifier+5    

EndAreaPoints:
         ldy #$0b               
         lda CurrentPlayer      
         beq ELPGive            
         ldy #$11               
ELPGive: jsr DigitsMathRoutine  
         lda CurrentPlayer      
         asl                    
         asl                    
         asl
         asl
         ora #%00000100         
         jmp UpdateNumber       

RaiseFlagSetoffFWorks:
         lda Enemy_Y_Position,x  
         cmp #$72                
         bcc SetoffF             
         dec Enemy_Y_Position,x  
         jmp DrawStarFlag        
SetoffF: lda FireworksCounter    
         beq DrawFlagSetTimer    
         bmi DrawFlagSetTimer    
         lda #Fireworks
         sta EnemyFrenzyBuffer   

DrawStarFlag:
         jsr RelativeEnemyPosition  
         ldy Enemy_SprDataOffset,x  
         ldx #$03                   
DSFLoop: lda Enemy_Rel_YPos         
         clc
         adc StarFlagYPosAdder,x    
         sta Sprite_Y_Position,y    
         lda StarFlagTileData,x     
         sta Sprite_Tilenumber,y    
         lda #$22                   
         sta Sprite_Attributes,y    
         lda Enemy_Rel_XPos         
         clc
         adc StarFlagXPosAdder,x    
         sta Sprite_X_Position,y    
         iny
         iny                        
         iny                        
         iny
         dex                        
         bpl DSFLoop                
         ldx ObjectOffset           
         rts

DrawFlagSetTimer:
      jsr DrawStarFlag          
      lda #$06
      sta EnemyIntervalTimer,x  

IncrementSFTask2:
      inc StarFlagTaskControl   
      rts

DelayToAreaEnd:
      jsr DrawStarFlag          
      lda EnemyIntervalTimer,x  
      bne StarFlagExit2         
      lda EventMusicBuffer      
      beq IncrementSFTask2      

StarFlagExit2:
      rts                       




MovePiranhaPlant:
      lda Enemy_State,x           
      bne PutinPipe               
      lda EnemyFrameTimer,x       
      bne PutinPipe               
      lda PiranhaPlant_MoveFlag,x 
      bne SetupToMovePPlant       
      lda PiranhaPlant_Y_Speed,x  
      bmi ReversePlantSpeed       
      jsr PlayerEnemyDiff         
      bpl ChkPlayerNearPipe       
      lda $00                     
      eor #$ff
      clc                         
      adc #$01
      sta $00                     

ChkPlayerNearPipe:
      lda $00                     
      cmp #$21
      bcc PutinPipe               

ReversePlantSpeed:
      lda PiranhaPlant_Y_Speed,x  
      eor #$ff
      clc                         
      adc #$01
      sta PiranhaPlant_Y_Speed,x  
      inc PiranhaPlant_MoveFlag,x 

SetupToMovePPlant:
      lda PiranhaPlantDownYPos,x  
      ldy PiranhaPlant_Y_Speed,x  
      bpl RiseFallPiranhaPlant    
      lda PiranhaPlantUpYPos,x    

RiseFallPiranhaPlant:
      sta $00                     
      lda FrameCounter            
      lsr
      bcc PutinPipe               
      lda TimerControl            
      bne PutinPipe               
      lda Enemy_Y_Position,x      
      clc
      adc PiranhaPlant_Y_Speed,x  
      sta Enemy_Y_Position,x      
      cmp $00                     
      bne PutinPipe               
      lda #$00
      sta PiranhaPlant_MoveFlag,x 
      lda #$40
      sta EnemyFrameTimer,x       

PutinPipe:
      lda #%00100000              
      sta Enemy_SprAttrib,x       
      rts                         




FirebarSpin:
      sta $07                     
      lda FirebarSpinDirection,x  
      bne SpinCounterClockwise    
      ldy #$18                    
      lda FirebarSpinState_Low,x
      clc                         
      adc $07                     
      sta FirebarSpinState_Low,x
      lda FirebarSpinState_High,x 
      adc #$00
      rts

SpinCounterClockwise:
      ldy #$08                    
      lda FirebarSpinState_Low,x
      sec                         
      sbc $07                     
      sta FirebarSpinState_Low,x
      lda FirebarSpinState_High,x 
      sbc #$00
      rts






BalancePlatform:
       lda Enemy_Y_HighPos,x       
       cmp #$03
       bne DoBPl
       jmp EraseEnemyObject        
DoBPl: lda Enemy_State,x           
       bpl CheckBalPlatform        
       rts

CheckBalPlatform:
       tay                         
       lda PlatformCollisionFlag,x 
       sta $00                     
       lda Enemy_MovingDir,x       
       beq ChkForFall
       jmp PlatformFall            

ChkForFall:
       lda #$2d                    
       cmp Enemy_Y_Position,x
       bcc ChkOtherForFall         
       cpy $00                     
       beq MakePlatformFall        
       clc
       adc #$02                    
       sta Enemy_Y_Position,x      
       jmp StopPlatforms           

MakePlatformFall:
       jmp InitPlatformFall        

ChkOtherForFall:
       cmp Enemy_Y_Position,y      
       bcc ChkToMoveBalPlat        
       cpx $00                     
       beq MakePlatformFall        
       clc
       adc #$02                    
       sta Enemy_Y_Position,y      
       jmp StopPlatforms           

ChkToMoveBalPlat:
        lda Enemy_Y_Position,x      
        pha
        lda PlatformCollisionFlag,x 
        bpl ColFlg                  
        lda Enemy_Y_MoveForce,x
        clc                         
        adc #$05
        sta $00                     
        lda Enemy_Y_Speed,x
        adc #$00                    
        bmi PlatDn                  
        bne PlatUp                  
        lda $00
        cmp #$0b                    
        bcc PlatSt                  
        bcs PlatUp                  
ColFlg: cmp ObjectOffset            
        beq PlatDn                  
PlatUp: jsr MovePlatformUp          
        jmp DoOtherPlatform         
PlatSt: jsr StopPlatforms           
        jmp DoOtherPlatform         
PlatDn: jsr MovePlatformDown        

DoOtherPlatform:
       ldy Enemy_State,x           
       pla                         
       sec
       sbc Enemy_Y_Position,x      
       clc
       adc Enemy_Y_Position,y      
       sta Enemy_Y_Position,y      
       lda PlatformCollisionFlag,x 
       bmi DrawEraseRope
       tax                         
       jsr PositionPlayerOnVPlat   

DrawEraseRope:
         ldy ObjectOffset            
         lda Enemy_Y_Speed,y         
         ora Enemy_Y_MoveForce,y     
         beq ExitRp                  
         ldx VRAM_Buffer1_Offset     
         cpx #$20                    
         bcs ExitRp                  
         lda Enemy_Y_Speed,y
         pha                         
         pha
         jsr SetupPlatformRope       
         lda $01                     
         sta VRAM_Buffer1,x          
         lda $00
         sta VRAM_Buffer1+1,x
         lda #$02                    
         sta VRAM_Buffer1+2,x
         lda Enemy_Y_Speed,y         
         bmi EraseR1                 
         lda #$a2
         sta VRAM_Buffer1+3,x        
         lda #$a3                    
         sta VRAM_Buffer1+4,x
         jmp OtherRope               
EraseR1: lda #$24                    
         sta VRAM_Buffer1+3,x        
         sta VRAM_Buffer1+4,x

OtherRope:
         lda Enemy_State,y           
         tay                         
         pla                         
         eor #$ff                    
         jsr SetupPlatformRope       
         lda $01                     
         sta VRAM_Buffer1+5,x        
         lda $00                     
         sta VRAM_Buffer1+6,x
         lda #$02
         sta VRAM_Buffer1+7,x        
         pla                         
         bpl EraseR2                 
         lda #$a2
         sta VRAM_Buffer1+8,x        
         lda #$a3                    
         sta VRAM_Buffer1+9,x        
         jmp EndRp                   
EraseR2: lda #$24                    
         sta VRAM_Buffer1+8,x        
         sta VRAM_Buffer1+9,x
EndRp:   lda #$00                    
         sta VRAM_Buffer1+10,x
         lda VRAM_Buffer1_Offset     
         clc                         
         adc #10
         sta VRAM_Buffer1_Offset
ExitRp:  ldx ObjectOffset            
         rts

SetupPlatformRope:
        pha                     
        lda Enemy_X_Position,y  
        clc
        adc #$08                
        ldx SecondaryHardMode   
        bne GetLRp              
        clc
        adc #$10                
GetLRp: pha                     
        lda Enemy_PageLoc,y
        adc #$00                
        sta $02                 
        pla                     
        and #%11110000          
        lsr                     
        lsr
        lsr
        sta $00                 
        ldx Enemy_Y_Position,y  
        pla                     
        bpl GetHRp              
        txa
        clc
        adc #$08                
        tax                     
GetHRp: txa                     
        ldx VRAM_Buffer1_Offset 
        asl
        rol                     
        pha                     
        rol                     
        and #%00000011          
        ora #%00100000          
        sta $01                 
        lda $02                 
        and #$01                
        asl
        asl                     
        ora $01                 
        sta $01                 
        pla                     
        and #%11100000          
        clc
        adc $00                 
        sta $00                 
        lda Enemy_Y_Position,y
        cmp #$e8                
        bcc ExPRp               
        lda $00
        and #%10111111          
        sta $00
ExPRp:  rts                     

InitPlatformFall:
      tya                        
      tax
      jsr GetEnemyOffscreenBits  
      lda #$06
      jsr SetupFloateyNumber     
      lda Player_Rel_XPos
      sta FloateyNum_X_Pos,x     
      lda Player_Y_Position
      sta FloateyNum_Y_Pos,x
      lda #$01                   
      sta Enemy_MovingDir,x      

StopPlatforms:
      jsr InitVStf             
      sta Enemy_Y_Speed,y      
      sta Enemy_Y_MoveForce,y
      rts

PlatformFall:
      tya                         
      pha
      jsr MoveFallingPlatform     
      pla
      tax                         
      jsr MoveFallingPlatform     
      ldx ObjectOffset
      lda PlatformCollisionFlag,x 
      bmi ExPF                    
      tax                         
      jsr PositionPlayerOnVPlat   
ExPF: ldx ObjectOffset            
      rts



YMovingPlatform:
        lda Enemy_Y_Speed,x          
        ora Enemy_Y_MoveForce,x      
        bne ChkYCenterPos
        sta Enemy_YMF_Dummy,x        
        lda Enemy_Y_Position,x
        cmp YPlatformTopYPos,x       
        bcs ChkYCenterPos            
        lda FrameCounter
        and #%00000111               
        bne SkipIY
        inc Enemy_Y_Position,x       
SkipIY: jmp ChkYPCollision           

ChkYCenterPos:
        lda Enemy_Y_Position,x       
        cmp YPlatformCenterYPos,x    
        bcc YMDown
        jsr MovePlatformUp           
        jmp ChkYPCollision
YMDown: jsr MovePlatformDown         

ChkYPCollision:
       lda PlatformCollisionFlag,x  
       bmi ExYPl                    
       jsr PositionPlayerOnVPlat    
ExYPl: rts                          




XMovingPlatform:
      lda #$0e                     
      jsr XMoveCntr_Platform       
      jsr MoveWithXMCntrs          
      lda PlatformCollisionFlag,x  
      bmi ExXMP                    

PositionPlayerOnHPlat:
         lda Player_X_Position
         clc                       
         adc $00                   
         sta Player_X_Position     
         lda Player_PageLoc        
         ldy $00                   
         bmi PPHSubt               
         adc #$00                  
         jmp SetPVar               
PPHSubt: sbc #$00                  
SetPVar: sta Player_PageLoc        
         sty Platform_X_Scroll     
         jsr PositionPlayerOnVPlat 
ExXMP:   rts                       



DropPlatform:
       lda PlatformCollisionFlag,x  
       bmi ExDPl                    
       jsr MoveDropPlatform         
       jsr PositionPlayerOnVPlat    
ExDPl: rts                          




RightPlatform:
       jsr MoveEnemyHorizontally     
       sta $00                       
       lda PlatformCollisionFlag,x   
       bmi ExRPl                     
       lda #$10
       sta Enemy_X_Speed,x           
       jsr PositionPlayerOnHPlat     
ExRPl: rts                           



MoveLargeLiftPlat:
      jsr MoveLiftPlatforms  
      jmp ChkYPCollision     

MoveSmallPlatform:
      jsr MoveLiftPlatforms      
      jmp ChkSmallPlatCollision  

MoveLiftPlatforms:
      lda TimerControl         
      bne ExLiftP              
      lda Enemy_YMF_Dummy,x
      clc                      
      adc Enemy_Y_MoveForce,x
      sta Enemy_YMF_Dummy,x
      lda Enemy_Y_Position,x   
      adc Enemy_Y_Speed,x      
      sta Enemy_Y_Position,x   
      rts

ChkSmallPlatCollision:
         lda PlatformCollisionFlag,x 
         beq ExLiftP                 
         jsr PositionPlayerOnS_Plat  
ExLiftP: rts                         







OffscreenBoundsCheck:
          lda Enemy_ID,x          
          cmp #FlyingCheepCheep   
          beq ExScrnBd
          lda ScreenLeft_X_Pos    
          ldy Enemy_ID,x
          cpy #HammerBro          
          beq LimitB
          cpy #PiranhaPlant       
          bne ExtendLB            
LimitB:   adc #$38                
ExtendLB: sbc #$48                
          sta $01                 
          lda ScreenLeft_PageLoc
          sbc #$00                
          sta $00                 
          lda ScreenRight_X_Pos   
          adc #$48
          sta $03                 
          lda ScreenRight_PageLoc     
          adc #$00                
          sta $02                 
          lda Enemy_X_Position,x  
          cmp $01                 
          lda Enemy_PageLoc,x
          sbc $00                 
          bmi TooFar              
          lda Enemy_X_Position,x  
          cmp $03                 
          lda Enemy_PageLoc,x
          sbc $02                 
          bmi ExScrnBd            
          lda Enemy_State,x       
          cmp #HammerBro          
          beq ExScrnBd
          cpy #PiranhaPlant       
          beq ExScrnBd
          cpy #FlagpoleFlagObject 
          beq ExScrnBd
          cpy #StarFlagObject     
          beq ExScrnBd
          cpy #JumpspringObject   
          beq ExScrnBd            
TooFar:   jsr EraseEnemyObject    
ExScrnBd: rts                     





FireballEnemyCollision:
      lda Fireball_State,x  
      beq ExitFBallEnemy    
      asl
      bcs ExitFBallEnemy    
      lda FrameCounter
      lsr                   
      bcs ExitFBallEnemy    
      txa
      asl                   
      asl
      clc
      adc #$1c              
      tay                   
      ldx #$04

FireballEnemyCDLoop:
           stx $01                     
           tya
           pha                         
           lda Enemy_State,x
           and #%00100000              
           bne NoFToECol               
           lda Enemy_Flag,x            
           beq NoFToECol               
           lda Enemy_ID,x              
           cmp #$24
           bcc GoombaDie               
           cmp #$2b
           bcc NoFToECol               
GoombaDie: cmp #Goomba                 
           bne NotGoomba               
           lda Enemy_State,x           
           cmp #$02                    
           bcs NoFToECol               
NotGoomba: lda EnemyOffscrBitsMasked,x 
           bne NoFToECol               
           txa
           asl                         
           asl
           clc
           adc #$04                    
           tax                         
           jsr SprObjectCollisionCore  
           ldx ObjectOffset            
           bcc NoFToECol               
           lda #%10000000
           sta Fireball_State,x        
           ldx $01                     
           jsr HandleEnemyFBallCol     
NoFToECol: pla                         
           tay                         
           ldx $01                     
           dex                         
           bpl FireballEnemyCDLoop     

ExitFBallEnemy:
      ldx ObjectOffset                 
      rts

BowserIdentities:


HandleEnemyFBallCol:
      jsr RelativeEnemyPosition  
      ldx $01                    
      lda Enemy_Flag,x           
      bpl ChkBuzzyBeetle         
      and #%00001111             
      tax                        
      lda Enemy_ID,x
      cmp #Bowser                
      beq HurtBowser             
      ldx $01                    

ChkBuzzyBeetle:
      lda Enemy_ID,x
      cmp #BuzzyBeetle           
      beq ExHCF                  
      cmp #Bowser                
      bne ChkOtherEnemies        

HurtBowser:
          dec BowserHitPoints        
          bne ExHCF                  
          jsr InitVStf               
          sta Enemy_X_Speed,x        
          sta EnemyFrenzyBuffer      
          lda #$fe
          sta Enemy_Y_Speed,x        
          ldy WorldNumber            
          lda BowserIdentities,y     
          sta Enemy_ID,x             
          lda #$20                   
          cpy #$03                   
          bcs SetDBSte               
          ora #$03                   
SetDBSte: sta Enemy_State,x          
          lda #Sfx_BowserFall
          sta Square2SoundQueue      
          ldx $01                    
          lda #$09                   
          bne EnemySmackScore        

ChkOtherEnemies:
      cmp #BulletBill_FrenzyVar
      beq ExHCF                 
      cmp #Podoboo       
      beq ExHCF                 
      cmp #$15       
      bcs ExHCF                 

ShellOrBlockDefeat:
      lda Enemy_ID,x            
      cmp #PiranhaPlant
      bne StnE                  
      lda Enemy_Y_Position,x
      adc #$18                  
      sta Enemy_Y_Position,x
StnE: jsr ChkToStunEnemies      
      lda Enemy_State,x
      and #%00011111            
      ora #%00100000            
      sta Enemy_State,x
      lda #$02                  
      ldy Enemy_ID,x            
      cpy #HammerBro
      bne GoombaPoints          
      lda #$06                  

GoombaPoints:
      cpy #Goomba               
      bne EnemySmackScore       
      lda #$01                  

EnemySmackScore:
       jsr SetupFloateyNumber   
       lda #Sfx_EnemySmack      
       sta Square1SoundQueue
ExHCF: rts                      



PlayerHammerCollision:
        lda FrameCounter          
        lsr                       
        bcc ExPHC                 
        lda TimerControl          
        ora Misc_OffscreenBits    
        bne ExPHC                 
        txa
        asl                       
        asl
        clc
        adc #$24                  
        tay                       
        jsr PlayerCollisionCore   
        ldx ObjectOffset          
        bcc ClHCol                
        lda Misc_Collision_Flag,x 
        bne ExPHC                 
        lda #$01
        sta Misc_Collision_Flag,x 
        lda Misc_X_Speed,x
        eor #$ff                  
        clc                       
        adc #$01
        sta Misc_X_Speed,x        
        lda StarInvincibleTimer   
        bne ExPHC                 
        jmp InjurePlayer          
ClHCol: lda #$00                  
        sta Misc_Collision_Flag,x
ExPHC:  rts



HandlePowerUpCollision:
      jsr EraseEnemyObject    
      lda #$06
      jsr SetupFloateyNumber  
      lda #Sfx_PowerUpGrab
      sta Square2SoundQueue   
      lda PowerUpType         
      cmp #$02
      bcc Shroom_Flower_PUp   
      cmp #$03
      beq SetFor1Up           
      lda #$23                
      sta StarInvincibleTimer 
      lda #StarPowerMusic     
      sta AreaMusicQueue
      rts

Shroom_Flower_PUp:
      lda PlayerStatus    
      beq UpToSuper
      cmp #$01            
      bne NoPUp
      ldx ObjectOffset    
      lda #$02            
      sta PlayerStatus
      jsr GetPlayerColors 
      ldx ObjectOffset    
      lda #$0c            
      jmp UpToFiery       

SetFor1Up:
      lda #$0b                 
      sta FloateyNum_Control,x 
      rts

UpToSuper:
       lda #$01         
       sta PlayerStatus
       lda #$09         

UpToFiery:
       ldy #$00         
       jsr SetPRout     
NoPUp: rts



ResidualXSpdData:


KickedShellXSpdData:


DemotedKoopaXSpdData:


PlayerEnemyCollision:
         lda FrameCounter            
         lsr
         bcs NoPUp                   
         jsr CheckPlayerVertical     
         bcs NoPECol                 
         lda EnemyOffscrBitsMasked,x 
         bne NoPECol                 
         lda GameEngineSubroutine
         cmp #$08                    
         bne NoPECol                 
         lda Enemy_State,x
         and #%00100000              
         bne NoPECol
         jsr GetEnemyBoundBoxOfs     
         jsr PlayerCollisionCore     
         ldx ObjectOffset            
         bcs CheckForPUpCollision    
         lda Enemy_CollisionBits,x
         and #%11111110              
         sta Enemy_CollisionBits,x   
NoPECol: rts

CheckForPUpCollision:
       ldy Enemy_ID,x
       cpy #PowerUpObject            
       bne EColl                     
       jmp HandlePowerUpCollision    
EColl: lda StarInvincibleTimer       
       beq HandlePECollisions        
       jmp ShellOrBlockDefeat        

KickedShellPtsData:


HandlePECollisions:
       lda Enemy_CollisionBits,x    
       and #%00000001               
       ora EnemyOffscrBitsMasked,x
       bne ExPEC                    
       lda #$01
       ora Enemy_CollisionBits,x    
       sta Enemy_CollisionBits,x
       cpy #Spiny                   
       beq ChkForPlayerInjury
       cpy #PiranhaPlant            
       beq InjurePlayer
       cpy #Podoboo                 
       beq InjurePlayer
       cpy #BulletBill_CannonVar    
       beq ChkForPlayerInjury
       cpy #$15                     
       bcs InjurePlayer
       lda AreaType                 
       beq InjurePlayer
       lda Enemy_State,x            
       asl
       bcs ChkForPlayerInjury
       lda Enemy_State,x            
       and #%00000111
       cmp #$02                     
       bcc ChkForPlayerInjury
       lda Enemy_ID,x               
       cmp #Goomba
       beq ExPEC
       lda #Sfx_EnemySmack          
       sta Square1SoundQueue
       lda Enemy_State,x            
       ora #%10000000
       sta Enemy_State,x
       jsr EnemyFacePlayer          
       lda KickedShellXSpdData,y    
       sta Enemy_X_Speed,x
       lda #$03                     
       clc                          
       adc StompChainCounter
       ldy EnemyIntervalTimer,x     
       cpy #$03                     
       bcs KSPts                    
       lda KickedShellPtsData,y     
KSPts: jsr SetupFloateyNumber       
ExPEC: rts                          

ChkForPlayerInjury:
          lda Player_Y_Speed     
          bmi ChkInj             
          bne EnemyStomped       
ChkInj:   lda Enemy_ID,x         
          cmp #Bloober
          bcc ChkETmrs
          lda Player_Y_Position  
          clc
          adc #$0c
          cmp Enemy_Y_Position,x 
          bcc EnemyStomped       
ChkETmrs: lda StompTimer         
          bne EnemyStomped       
          lda InjuryTimer        
          bne ExInjColRoutines   
          lda Player_Rel_XPos
          cmp Enemy_Rel_XPos     
          bcc TInjE              
          jmp ChkEnemyFaceRight  
TInjE:    lda Enemy_MovingDir,x  
          cmp #$01               
          bne InjurePlayer       
          jmp LInj

InjurePlayer:
      lda InjuryTimer          
      bne ExInjColRoutines     

ForceInjury:
          ldx PlayerStatus          
          beq KillPlayer            
          sta PlayerStatus          
          lda #$08
          sta InjuryTimer           
          asl
          sta Square1SoundQueue     
          jsr GetPlayerColors       
          lda #$0a                  
SetKRout: ldy #$01                  
SetPRout: sta GameEngineSubroutine  
          sty Player_State          
          ldy #$ff
          sty TimerControl          
          iny
          sty ScrollAmount          

ExInjColRoutines:
      ldx ObjectOffset              
      rts

KillPlayer:
      stx Player_X_Speed   
      inx
      stx EventMusicQueue  
      lda #$fc
      sta Player_Y_Speed   
      lda #$0b             
      bne SetKRout         

StompedEnemyPtsData:


EnemyStomped:
      lda Enemy_ID,x             
      cmp #Spiny                 
      beq InjurePlayer
      lda #Sfx_EnemyStomp        
      sta Square1SoundQueue
      lda Enemy_ID,x
      ldy #$00                   
      cmp #FlyingCheepCheep      
      beq EnemyStompedPts
      cmp #BulletBill_FrenzyVar  
      beq EnemyStompedPts
      cmp #BulletBill_CannonVar
      beq EnemyStompedPts
      cmp #Podoboo               
      beq EnemyStompedPts        
      iny                        
      cmp #HammerBro             
      beq EnemyStompedPts
      iny                        
      cmp #Lakitu                
      beq EnemyStompedPts
      iny                        
      cmp #Bloober               
      bne ChkForDemoteKoopa

EnemyStompedPts:
      lda StompedEnemyPtsData,y  
      jsr SetupFloateyNumber     
      lda Enemy_MovingDir,x
      pha                        
      jsr SetStun                
      pla
      sta Enemy_MovingDir,x      
      lda #%00100000
      sta Enemy_State,x          
      jsr InitVStf               
      sta Enemy_X_Speed,x        
      lda #$fd                   
      sta Player_Y_Speed
      rts

ChkForDemoteKoopa:
      cmp #$09                   
      bcc HandleStompedShellE
      and #%00000001             
      sta Enemy_ID,x
      ldy #$00                   
      sty Enemy_State,x
      lda #$03                   
      jsr SetupFloateyNumber
      jsr InitVStf               
      jsr EnemyFacePlayer        
      lda DemotedKoopaXSpdData,y
      sta Enemy_X_Speed,x        
      jmp SBnce                  

RevivalRateData:


HandleStompedShellE:
       lda #$04                   
       sta Enemy_State,x
       inc StompChainCounter      
       lda StompChainCounter      
       clc                        
       adc StompTimer
       jsr SetupFloateyNumber     
       inc StompTimer             
       ldy PrimaryHardMode        
       lda RevivalRateData,y      
       sta EnemyIntervalTimer,x   
SBnce: lda #$fc                   
       sta Player_Y_Speed         
       rts

ChkEnemyFaceRight:
       lda Enemy_MovingDir,x 
       cmp #$01
       bne LInj              
       jmp InjurePlayer      
LInj:  jsr EnemyTurnAround   
       jmp InjurePlayer      


EnemyFacePlayer:
       ldy #$01               
       jsr PlayerEnemyDiff    
       bpl SFcRt              
       iny                    
SFcRt: sty Enemy_MovingDir,x  
       dey                    
       rts

SetupFloateyNumber:
       sta FloateyNum_Control,x 
       lda #$30
       sta FloateyNum_Timer,x   
       lda Enemy_Y_Position,x
       sta FloateyNum_Y_Pos,x   
       lda Enemy_Rel_XPos
       sta FloateyNum_X_Pos,x   
ExSFN: rts




SetBitsMask:


ClearBitsMask:


EnemiesCollision:
        lda FrameCounter            
        lsr
        bcc ExSFN                   
        lda AreaType
        beq ExSFN                   
        lda Enemy_ID,x
        cmp #$15                    
        bcs ExitECRoutine
        cmp #Lakitu                 
        beq ExitECRoutine
        cmp #PiranhaPlant           
        beq ExitECRoutine
        lda EnemyOffscrBitsMasked,x 
        bne ExitECRoutine
        jsr GetEnemyBoundBoxOfs     
        dex                         
        bmi ExitECRoutine           
ECLoop: stx $01                     
        tya                         
        pha
        lda Enemy_Flag,x            
        beq ReadyNextEnemy          
        lda Enemy_ID,x
        cmp #$15                    
        bcs ReadyNextEnemy          
        cmp #Lakitu
        beq ReadyNextEnemy          
        cmp #PiranhaPlant
        beq ReadyNextEnemy          
        lda EnemyOffscrBitsMasked,x
        bne ReadyNextEnemy          
        txa                         
        asl                         
        asl
        clc
        adc #$04
        tax                         
        jsr SprObjectCollisionCore  
        ldx ObjectOffset            
        ldy $01                     
        bcc NoEnemyCollision        
        lda Enemy_State,x
        ora Enemy_State,y           
        and #%10000000
        bne YesEC                   
        lda Enemy_CollisionBits,y   
        and SetBitsMask,x           
        bne ReadyNextEnemy          
        lda Enemy_CollisionBits,y
        ora SetBitsMask,x           
        sta Enemy_CollisionBits,y
YesEC:  jsr ProcEnemyCollisions     
        jmp ReadyNextEnemy          

NoEnemyCollision:
      lda Enemy_CollisionBits,y     
      and ClearBitsMask,x           
      sta Enemy_CollisionBits,y     

ReadyNextEnemy:
      pla              
      tay              
      ldx $01          
      dex
      bpl ECLoop       

ExitECRoutine:
      ldx ObjectOffset 
      rts              

ProcEnemyCollisions:
      lda Enemy_State,y        
      ora Enemy_State,x
      and #%00100000           
      bne ExitProcessEColl     
      lda Enemy_State,x
      cmp #$06                 
      bcc ProcSecondEnemyColl
      lda Enemy_ID,x           
      cmp #HammerBro           
      beq ExitProcessEColl
      lda Enemy_State,y        
      asl
      bcc ShellCollisions      
      lda #$06
      jsr SetupFloateyNumber   
      jsr ShellOrBlockDefeat   
      ldy $01                  

ShellCollisions:
      tya                      
      tax
      jsr ShellOrBlockDefeat   
      ldx ObjectOffset
      lda ShellChainCounter,x  
      clc
      adc #$04                 
      ldx $01
      jsr SetupFloateyNumber   
      ldx ObjectOffset         
      inc ShellChainCounter,x  

ExitProcessEColl:
      rts                      

ProcSecondEnemyColl:
      lda Enemy_State,y        
      cmp #$06
      bcc MoveEOfs
      lda Enemy_ID,y           
      cmp #HammerBro           
      beq ExitProcessEColl
      jsr ShellOrBlockDefeat   
      ldy $01
      lda ShellChainCounter,y  
      clc
      adc #$04                 
      ldx ObjectOffset
      jsr SetupFloateyNumber   
      ldx $01                  
      inc ShellChainCounter,x  
      rts                      

MoveEOfs:
      tya                      
      tax
      jsr EnemyTurnAround      
      ldx ObjectOffset         

EnemyTurnAround:
       lda Enemy_ID,x           
       cmp #PiranhaPlant
       beq ExTA                 
       cmp #Lakitu
       beq ExTA                 
       cmp #HammerBro
       beq ExTA                 
       cmp #Spiny
       beq RXSpd                
       cmp #GreenParatroopaJump
       beq RXSpd                
       cmp #$07
       bcs ExTA                 
RXSpd: lda Enemy_X_Speed,x      
       eor #$ff                 
       tay
       iny
       sty Enemy_X_Speed,x      
       lda Enemy_MovingDir,x
       eor #%00000011           
       sta Enemy_MovingDir,x    
ExTA:  rts                      




LargePlatformCollision:
       lda #$ff                     
       sta PlatformCollisionFlag,x
       lda TimerControl             
       bne ExLPC                    
       lda Enemy_State,x            
       bmi ExLPC                    
       lda Enemy_ID,x
       cmp #$24                     
       bne ChkForPlayerC_LargeP     
       lda Enemy_State,x
       tax                          
       jsr ChkForPlayerC_LargeP     

ChkForPlayerC_LargeP:
       jsr CheckPlayerVertical      
       bcs ExLPC                    
       txa
       jsr GetEnemyBoundBoxOfsArg   
       lda Enemy_Y_Position,x       
       sta $00                      
       txa                          
       pha
       jsr PlayerCollisionCore      
       pla                          
       tax
       bcc ExLPC                    
       jsr ProcLPlatCollisions      
ExLPC: ldx ObjectOffset             
       rts




SmallPlatformCollision:
      lda TimerControl             
      bne ExSPC                    
      sta PlatformCollisionFlag,x  
      jsr CheckPlayerVertical      
      bcs ExSPC                    
      lda #$02
      sta $00                      

ChkSmallPlatLoop:
      ldx ObjectOffset           
      jsr GetEnemyBoundBoxOfs    
      and #%00000010             
      bne ExSPC                  
      lda BoundingBox_UL_YPos,y  
      cmp #$20                   
      bcc MoveBoundBox           
      jsr PlayerCollisionCore    
      bcs ProcSPlatCollisions    

MoveBoundBox:
       lda BoundingBox_UL_YPos,y  
       clc                        
       adc #$80
       sta BoundingBox_UL_YPos,y
       lda BoundingBox_DR_YPos,y
       clc
       adc #$80
       sta BoundingBox_DR_YPos,y
       dec $00                    
       bne ChkSmallPlatLoop       
ExSPC: ldx ObjectOffset           
       rts



ProcSPlatCollisions:
      ldx ObjectOffset             

ProcLPlatCollisions:
      lda BoundingBox_DR_YPos,y    
      sec                          
      sbc BoundingBox_UL_YPos      
      cmp #$04                     
      bcs ChkForTopCollision       
      lda Player_Y_Speed           
      bpl ChkForTopCollision       
      lda #$01                     
      sta Player_Y_Speed           

ChkForTopCollision:
      lda BoundingBox_DR_YPos      
      sec                          
      sbc BoundingBox_UL_YPos,y    
      cmp #$06
      bcs PlatformSideCollisions   
      lda Player_Y_Speed
      bmi PlatformSideCollisions   
      lda $00                      
      ldy Enemy_ID,x
      cpy #$2b                     
      beq SetCollisionFlag         
      cpy #$2c                     
      beq SetCollisionFlag
      txa                          

SetCollisionFlag:
      ldx ObjectOffset             
      sta PlatformCollisionFlag,x  
      lda #$00
      sta Player_State             
      rts

PlatformSideCollisions:
         lda #$01                   
         sta $00                    
         lda BoundingBox_DR_XPos    
         sec                        
         sbc BoundingBox_UL_XPos,y
         cmp #$08                   
         bcc SideC
         inc $00                    
         lda BoundingBox_DR_XPos,y  
         clc                        
         sbc BoundingBox_UL_XPos
         cmp #$09                   
         bcs NoSideC                
SideC:   jsr ImpedePlayerMove       
NoSideC: ldx ObjectOffset           
         rts



PlayerPosSPlatData:


PositionPlayerOnS_Plat:
      tay                        
      lda Enemy_Y_Position,x     
      clc                        
      adc PlayerPosSPlatData-1,y 


PositionPlayerOnVPlat:
         lda Enemy_Y_Position,x    
         ldy GameEngineSubroutine
         cpy #$0b                  
         beq ExPlPos               
         ldy Enemy_Y_HighPos,x
         cpy #$01                  
         bne ExPlPos
         sec                       
         sbc #$20                  
         sta Player_Y_Position     
         tya
         sbc #$00                  
         sta Player_Y_HighPos      
         lda #$00
         sta Player_Y_Speed        
         sta Player_Y_MoveForce    
ExPlPos: rts



CheckPlayerVertical:
       lda Player_OffscreenBits  
       cmp #$f0                  
       bcs ExCPV
       ldy Player_Y_HighPos      
       dey                       
       bne ExCPV
       lda Player_Y_Position     
       cmp #$d0                  
ExCPV: rts



GetEnemyBoundBoxOfs:
      lda ObjectOffset         

GetEnemyBoundBoxOfsArg:
      asl                      
      asl                      
      clc
      adc #$04
      tay                      
      lda Enemy_OffscreenBits  
      and #%00001111           
      cmp #%00001111           
      rts






PlayerBGUpperExtent:


PlayerBGCollision:
          lda DisableCollisionDet   
          bne ExPBGCol              
          lda GameEngineSubroutine
          cmp #$0b                  
          beq ExPBGCol              
          cmp #$04
          bcc ExPBGCol              
          lda #$01                  
          ldy SwimmingFlag          
          bne SetPSte               
          lda Player_State          
          beq SetFallS              
          cmp #$03
          bne ChkOnScr              
SetFallS: lda #$02                  
SetPSte:  sta Player_State          
ChkOnScr: lda Player_Y_HighPos
          cmp #$01                  
          bne ExPBGCol              
          lda #$ff
          sta Player_CollisionBits  
          lda Player_Y_Position
          cmp #$cf                  
          bcc ChkCollSize           
ExPBGCol: rts                       

ChkCollSize:
         ldy #$02                    
         lda CrouchingFlag
         bne GBBAdr                  
         lda PlayerSize
         bne GBBAdr                  
         dey                         
         lda SwimmingFlag
         bne GBBAdr                  
         dey                         
GBBAdr:  lda BlockBufferAdderData,y  
         sta $eb                     
         tay                         
         ldx PlayerSize              
         lda CrouchingFlag
         beq HeadChk                 
         inx                         
HeadChk: lda Player_Y_Position       
         cmp PlayerBGUpperExtent,x   
         bcc DoFootCheck             
         jsr BlockBufferColli_Head   
         beq DoFootCheck             
         jsr CheckForCoinMTiles      
         bcs AwardTouchedCoin        
         ldy Player_Y_Speed          
         bpl DoFootCheck             
         ldy $04                     
         cpy #$04                    
         bcc DoFootCheck             
         jsr CheckForSolidMTiles     
         bcs SolidOrClimb            
         ldy AreaType                
         beq NYSpd                   
         ldy BlockBounceTimer        
         bne NYSpd                   
         jsr PlayerHeadCollision     
         jmp DoFootCheck             

SolidOrClimb:
       cmp #$26               
       beq NYSpd              
       lda #Sfx_Bump
       sta Square1SoundQueue  
NYSpd: lda #$01               
       sta Player_Y_Speed     

DoFootCheck:
      ldy $eb                    
      lda Player_Y_Position
      cmp #$cf                   
      bcs DoPlayerSideCheck      
      jsr BlockBufferColli_Feet  
      jsr CheckForCoinMTiles     
      bcs AwardTouchedCoin       
      pha                        
      jsr BlockBufferColli_Feet  
      sta $00                    
      pla
      sta $01                    
      bne ChkFootMTile           
      lda $00                    
      beq DoPlayerSideCheck      
      jsr CheckForCoinMTiles     
      bcc ChkFootMTile           

AwardTouchedCoin:
      jmp HandleCoinMetatile     

ChkFootMTile:
          jsr CheckForClimbMTiles    
          bcs DoPlayerSideCheck      
          ldy Player_Y_Speed         
          bmi DoPlayerSideCheck      
          cmp #$c5
          bne ContChk                
          jmp HandleAxeMetatile      
ContChk:  jsr ChkInvisibleMTiles     
          beq DoPlayerSideCheck      
          ldy JumpspringAnimCtrl     
          bne InitSteP               
          ldy $04                    
          cpy #$05                   
          bcc LandPlyr               
          lda Player_MovingDir
          sta $00                    
          jmp ImpedePlayerMove       
LandPlyr: jsr ChkForLandJumpSpring   
          lda #$f0
          and Player_Y_Position      
          sta Player_Y_Position      
          jsr HandlePipeEntry        
          lda #$00
          sta Player_Y_Speed         
          sta Player_Y_MoveForce     
          sta StompChainCounter      
InitSteP: lda #$00
          sta Player_State           

DoPlayerSideCheck:
      ldy $eb       
      iny
      iny           
      lda #$02      
      sta $00

SideCheckLoop:
       iny                       
       sty $eb                   
       lda Player_Y_Position
       cmp #$20                  
       bcc BHalf                 
       cmp #$e4
       bcs ExSCH                 
       jsr BlockBufferColli_Side 
       beq BHalf                 
       cmp #$1c                  
       beq BHalf                 
       cmp #$6b
       beq BHalf                 
       jsr CheckForClimbMTiles   
       bcc CheckSideMTiles       
BHalf: ldy $eb                   
       iny                       
       lda Player_Y_Position     
       cmp #$08
       bcc ExSCH                 
       cmp #$d0
       bcs ExSCH                 
       jsr BlockBufferColli_Side 
       bne CheckSideMTiles       
       dec $00                   
       bne SideCheckLoop         
ExSCH: rts                       

CheckSideMTiles:
          jsr ChkInvisibleMTiles     
          beq ExCSM                  
          jsr CheckForClimbMTiles    
          bcc ContSChk               
          jmp HandleClimbing         
ContSChk: jsr CheckForCoinMTiles     
          bcs HandleCoinMetatile     
          jsr ChkJumpspringMetatiles 
          bcc ChkPBtm                
          lda JumpspringAnimCtrl     
          bne ExCSM                  
          jmp StopPlayerMove         
ChkPBtm:  ldy Player_State           
          cpy #$00                   
          bne StopPlayerMove         
          ldy PlayerFacingDir        
          dey
          bne StopPlayerMove         
          cmp #$6c                   
          beq PipeDwnS               
          cmp #$1f                   
          bne StopPlayerMove         
PipeDwnS: lda Player_SprAttrib       
          bne PlyrPipe               
          ldy #Sfx_PipeDown_Injury
          sty Square1SoundQueue      
PlyrPipe: ora #%00100000
          sta Player_SprAttrib       
          lda Player_X_Position
          and #%00001111             
          beq ChkGERtn               
          ldy #$00                   
          lda ScreenLeft_PageLoc     
          beq SetCATmr               
          iny                        
SetCATmr: lda AreaChangeTimerData,y  
          sta ChangeAreaTimer
ChkGERtn: lda GameEngineSubroutine   
          cmp #$07
          beq ExCSM                  
          cmp #$08                   
          bne ExCSM
          lda #$02
          sta GameEngineSubroutine   
          rts                        






StopPlayerMove:
       jsr ImpedePlayerMove      
ExCSM: rts                       
      
AreaChangeTimerData:


HandleCoinMetatile:
      jsr ErACM             
      inc CoinTallyFor1Ups  
      jmp GiveOneCoin       

HandleAxeMetatile:
       lda #$00
       sta OperMode_Task   
       lda #$02
       sta OperMode        
       lda #$18
       sta Player_X_Speed  
ErACM: ldy $02             
       lda #$00            
       sta ($06),y         
       jmp RemoveCoin_Axe  






ClimbXPosAdder:


ClimbPLocAdder:


FlagpoleYPosData:


HandleClimbing:
      ldy $04            
      cpy #$06           
      bcc ExHC           
      cpy #$0a           
      bcc ChkForFlagpole
ExHC: rts                

ChkForFlagpole:
      cmp #$24               
      beq FlagpoleCollision  
      cmp #$25
      bne VineCollision      

FlagpoleCollision:
      lda GameEngineSubroutine
      cmp #$05                  
      beq PutPlayerOnVine       
      lda #$01
      sta PlayerFacingDir       
      inc ScrollLock            
      lda GameEngineSubroutine
      cmp #$04                  
      beq RunFR                 
      lda #BulletBill_CannonVar 
      jsr KillEnemies           
      lda #Silence
      sta EventMusicQueue       
      lsr
      sta FlagpoleSoundQueue    
      ldx #$04                  
      lda Player_Y_Position
      sta FlagpoleCollisionYPos 

ChkFlagpoleYPosLoop:
       cmp FlagpoleYPosData,x    
       bcs MtchF                 
       dex                       
       bne ChkFlagpoleYPosLoop   
MtchF: stx FlagpoleScore         
RunFR: lda #$04
       sta GameEngineSubroutine  
       jmp PutPlayerOnVine       

VineCollision:
      cmp #$26                  
      bne PutPlayerOnVine
      lda Player_Y_Position     
      cmp #$20                  
      bcs PutPlayerOnVine       
      lda #$01
      sta GameEngineSubroutine  

PutPlayerOnVine:
         lda #$03                
         sta Player_State
         lda #$00                
         sta Player_X_Speed      
         sta Player_X_MoveForce
         lda Player_X_Position   
         sec
         sbc ScreenLeft_X_Pos    
         cmp #$10
         bcs SetVXPl             
         lda #$02
         sta PlayerFacingDir     
SetVXPl: ldy PlayerFacingDir     
         lda $06                 
         asl
         asl                     
         asl
         asl
         clc
         adc ClimbXPosAdder-1,y  
         sta Player_X_Position   
         lda $06                 
         bne ExPVne              
         lda ScreenRight_PageLoc 
         clc
         adc ClimbPLocAdder-1,y  
         sta Player_PageLoc      
ExPVne:  rts                     



ChkInvisibleMTiles:
         cmp #$5f       
         beq ExCInvT    
         cmp #$60       
ExCInvT: rts            





ChkForLandJumpSpring:
        jsr ChkJumpspringMetatiles  
        bcc ExCJSp                  
        lda #$70
        sta VerticalForce           
        lda #$f9
        sta JumpspringForce         
        lda #$03
        sta JumpspringTimer         
        lsr
        sta JumpspringAnimCtrl      
ExCJSp: rts                         

ChkJumpspringMetatiles:
         cmp #$67      
         beq JSFnd     
         cmp #$68      
         clc           
         bne NoJSFnd   
JSFnd:   sec           
NoJSFnd: rts           

HandlePipeEntry:
         lda Up_Down_Buttons       
         and #%00000100            
         beq ExPipeE               
         lda $00
         cmp #$11                  
         bne ExPipeE               
         lda $01
         cmp #$10                  
         bne ExPipeE               
         lda #$30
         sta ChangeAreaTimer       
         lda #$03
         sta GameEngineSubroutine  
         lda #Sfx_PipeDown_Injury
         sta Square1SoundQueue     
         lda #%00100000
         sta Player_SprAttrib      
         lda WarpZoneControl       
         beq ExPipeE               
         and #%00000011            
         asl
         asl                       
         tax                       
         lda Player_X_Position     
         cmp #$60      
         bcc GetWNum               
         inx                       
         cmp #$a0      
         bcc GetWNum               
         inx                       
GetWNum: ldy WarpZoneNumbers,x     
         dey                       
         sty WorldNumber           
         ldx WorldAddrOffsets,y    
         lda AreaAddrOffsets,x     
         sta AreaPointer           
         lda #Silence
         sta EventMusicQueue       
         lda #$00
         sta EntrancePage          
         sta AreaNumber            
         sta LevelNumber           
         sta AltEntranceControl    
         inc Hidden1UpFlag         
         inc FetchNewGameTimerFlag 
ExPipeE: rts                       

ImpedePlayerMove:
       lda #$00                  
       ldy Player_X_Speed        
       ldx $00                   
       dex                       
       bne RImpd                 
       inx                       
       cpy #$00                  
       bmi ExIPM                 
       lda #$ff                  
       jmp NXSpd                 
RImpd: ldx #$02                  
       cpy #$01                  
       bpl ExIPM                 
       lda #$01                  
NXSpd: ldy #$10
       sty SideCollisionTimer    
       ldy #$00
       sty Player_X_Speed        
       cmp #$00                  
       bpl PlatF                 
       dey                       
PlatF: sty $00                   
       clc
       adc Player_X_Position     
       sta Player_X_Position     
       lda Player_PageLoc
       adc $00                   
       sta Player_PageLoc        
ExIPM: txa                       
       eor #$ff
       and Player_CollisionBits  
       sta Player_CollisionBits  
       rts



SolidMTileUpperExt:


CheckForSolidMTiles:
      jsr GetMTileAttrib        
      cmp SolidMTileUpperExt,x  
      rts

ClimbMTileUpperExt:


CheckForClimbMTiles:
      jsr GetMTileAttrib        
      cmp ClimbMTileUpperExt,x  
      rts

CheckForCoinMTiles:
         cmp #$c2              
         beq CoinSd            
         cmp #$c3              
         beq CoinSd            
         clc                   
         rts
CoinSd:  lda #Sfx_CoinGrab
         sta Square2SoundQueue 
         rts

GetMTileAttrib:
       tay            
       and #%11000000 
       asl
       rol            
       rol
       tax            
       tya            
ExEBG: rts            




EnemyBGCStateData:


EnemyBGCXSpdData:


EnemyToBGCollisionDet:
      lda Enemy_State,x        
      and #%00100000
      bne ExEBG                
      jsr SubtEnemyYPos        
      bcc ExEBG                
      ldy Enemy_ID,x
      cpy #Spiny               
      bne DoIDCheckBGColl
      lda Enemy_Y_Position,x
      cmp #$25                 
      bcc ExEBG

DoIDCheckBGColl:
       cpy #GreenParatroopaJump 
       bne HBChk                
       jmp EnemyJump            
HBChk: cpy #HammerBro           
       bne CInvu                
       jmp HammerBroBGColl      
CInvu: cpy #Spiny               
       beq YesIn
       cpy #PowerUpObject       
       beq YesIn
       cpy #$07                 
       bcs ExEBGChk
YesIn: jsr ChkUnderEnemy        
       bne HandleEToBGCollision 

NoEToBGCollision:
       jmp ChkForRedKoopa       




HandleEToBGCollision:
      jsr ChkForNonSolids       
      beq NoEToBGCollision      
      cmp #$23
      bne LandEnemyProperly     
      ldy $02                   
      lda #$00                  
      sta ($06),y               
      lda Enemy_ID,x
      cmp #$15                  
      bcs ChkToStunEnemies
      cmp #Goomba               
      bne GiveOEPoints
      jsr KillEnemyAboveBlock   

GiveOEPoints:
      lda #$01                  
      jsr SetupFloateyNumber

ChkToStunEnemies:
          cmp #$09                   
          bcc SetStun      
          cmp #$11                   
          bcs SetStun                
          cmp #$0a                   
          bcc Demote                 
          cmp #PiranhaPlant          
          bcc SetStun                
Demote:   and #%00000001             
          sta Enemy_ID,x             
SetStun:  lda Enemy_State,x          
          and #%11110000             
          ora #%00000010
          sta Enemy_State,x          
          dec Enemy_Y_Position,x
          dec Enemy_Y_Position,x     
          lda Enemy_ID,x
          cmp #Bloober               
          beq SetWYSpd
          lda #$fd                   
          ldy AreaType
          bne SetNotW                
SetWYSpd: lda #$ff                   
SetNotW:  sta Enemy_Y_Speed,x        
          ldy #$01
          jsr PlayerEnemyDiff        
          bpl ChkBBill               
          iny                        
ChkBBill: lda Enemy_ID,x      
          cmp #BulletBill_CannonVar  
          beq NoCDirF
          cmp #BulletBill_FrenzyVar  
          beq NoCDirF                
          sty Enemy_MovingDir,x      
NoCDirF:  dey                        
          lda EnemyBGCXSpdData,y     
          sta Enemy_X_Speed,x        
ExEBGChk: rts




LandEnemyProperly:
       lda $04                 
       sec
       sbc #$08                
       cmp #$05                
       bcs ChkForRedKoopa      
       lda Enemy_State,x      
       and #%01000000          
       bne LandEnemyInitState
       lda Enemy_State,x
       asl                     
       bcc ChkLandedEnemyState
SChkA: jmp DoEnemySideCheck    

ChkLandedEnemyState:
           lda Enemy_State,x         
           beq SChkA
           cmp #$05                  
           beq ProcEnemyDirection    
           cmp #$03                  
           bcs ExSteChk              
           lda Enemy_State,x         
           cmp #$02                  
           bne ProcEnemyDirection    
           lda #$10                  
           ldy Enemy_ID,x            
           cpy #Spiny
           bne SetForStn             
           lda #$00                  
SetForStn: sta EnemyIntervalTimer,x  
           lda #$03                  
           sta Enemy_State,x         
           jsr EnemyLanding          
ExSteChk:  rts                       

ProcEnemyDirection:
         lda Enemy_ID,x            
         cmp #Goomba               
         beq LandEnemyInitState
         cmp #Spiny                
         bne InvtD                 
         lda #$01
         sta Enemy_MovingDir,x     
         lda #$08
         sta Enemy_X_Speed,x       
         lda FrameCounter
         and #%00000111            
         beq LandEnemyInitState    
InvtD:   ldy #$01                  
         jsr PlayerEnemyDiff       
         bpl CNwCDir               
         iny                       
CNwCDir: tya
         cmp Enemy_MovingDir,x     
         bne LandEnemyInitState
         jsr ChkForBump_HammerBroJ 

LandEnemyInitState:
      jsr EnemyLanding       
      lda Enemy_State,x
      and #%10000000         
      bne NMovShellFallBit
      lda #$00               
      sta Enemy_State,x      
      rts

NMovShellFallBit:
      lda Enemy_State,x   
      and #%10111111      
      sta Enemy_State,x
      rts



ChkForRedKoopa:
             lda Enemy_ID,x            
             cmp #RedKoopa
             bne Chk2MSBSt             
             lda Enemy_State,x
             beq ChkForBump_HammerBroJ 
Chk2MSBSt:   lda Enemy_State,x         
             tay
             asl                       
             bcc GetSteFromD           
             lda Enemy_State,x
             ora #%01000000            
             jmp SetD6Ste              
GetSteFromD: lda EnemyBGCStateData,y   
SetD6Ste:    sta Enemy_State,x         





DoEnemySideCheck:
          lda Enemy_Y_Position,x     
          cmp #$20                   
          bcc ExESdeC
          ldy #$16                   
          lda #$02                   
          sta $eb                    
SdeCLoop: lda $eb                    
          cmp Enemy_MovingDir,x      
          bne NextSdeC               
          lda #$01                   
          jsr BlockBufferChk_Enemy   
          beq NextSdeC               
          jsr ChkForNonSolids        
          bne ChkForBump_HammerBroJ  
NextSdeC: dec $eb                    
          iny
          cpy #$18                   
          bcc SdeCLoop               
ExESdeC:  rts

ChkForBump_HammerBroJ: 
        cpx #$05               
        beq NoBump             
        lda Enemy_State,x      
        asl                    
        bcc NoBump
        lda #Sfx_Bump          
        sta Square1SoundQueue  
NoBump: lda Enemy_ID,x         
        cmp #$05
        bne InvEnemyDir        
        lda #$00
        sta $00                
        ldy #$fa               
        jmp SetHJ              

InvEnemyDir:
      jmp RXSpd     




PlayerEnemyDiff:
      lda Enemy_X_Position,x  
      sec                     
      sbc Player_X_Position   
      sta $00                 
      lda Enemy_PageLoc,x
      sbc Player_PageLoc      
      rts



EnemyLanding:
      jsr InitVStf            
      lda Enemy_Y_Position,x
      and #%11110000          
      ora #%00001000          
      sta Enemy_Y_Position,x  
      rts

SubtEnemyYPos:
      lda Enemy_Y_Position,x  
      clc                     
      adc #$3e
      cmp #$44                
      rts                     

EnemyJump:
        jsr SubtEnemyYPos     
        bcc DoSide            
        lda Enemy_Y_Speed,x
        clc                   
        adc #$02
        cmp #$03              
        bcc DoSide
        jsr ChkUnderEnemy     
        beq DoSide            
        jsr ChkForNonSolids   
        beq DoSide            
        jsr EnemyLanding      
        lda #$fd
        sta Enemy_Y_Speed,x   
DoSide: jmp DoEnemySideCheck  



HammerBroBGColl:
      jsr ChkUnderEnemy    
      beq NoUnderHammerBro      
      cmp #$23             
      bne UnderHammerBro

KillEnemyAboveBlock:
      jsr ShellOrBlockDefeat  
      lda #$fc                
      sta Enemy_Y_Speed,x
      rts

UnderHammerBro:
      lda EnemyFrameTimer,x 
      bne NoUnderHammerBro  
      lda Enemy_State,x
      and #%10001000        
      sta Enemy_State,x     
      jsr EnemyLanding      
      jmp DoEnemySideCheck  

NoUnderHammerBro:
      lda Enemy_State,x  
      ora #$01           
      sta Enemy_State,x
      rts

ChkUnderEnemy:
      lda #$00                  
      ldy #$15                  
      jmp BlockBufferChk_Enemy  

ChkForNonSolids:
       cmp #$26       
       beq NSFnd
       cmp #$c2       
       beq NSFnd
       cmp #$c3       
       beq NSFnd
       cmp #$5f       
       beq NSFnd
       cmp #$60       
NSFnd: rts



FireballBGCollision:
      lda Fireball_Y_Position,x   
      cmp #$18
      bcc ClearBounceFlag         
      jsr BlockBufferChk_FBall    
      beq ClearBounceFlag         
      jsr ChkForNonSolids         
      beq ClearBounceFlag         
      lda Fireball_Y_Speed,x      
      bmi InitFireballExplode     
      lda FireballBouncingFlag,x  
      bne InitFireballExplode     
      lda #$fd
      sta Fireball_Y_Speed,x      
      lda #$01
      sta FireballBouncingFlag,x  
      lda Fireball_Y_Position,x
      and #$f8                    
      sta Fireball_Y_Position,x   
      rts                         

ClearBounceFlag:
      lda #$00
      sta FireballBouncingFlag,x  
      rts                         

InitFireballExplode:
      lda #$80
      sta Fireball_State,x        
      lda #Sfx_Bump
      sta Square1SoundQueue       
      rts                         








BoundBoxCtrlData:













GetFireballBoundBox:
      txa         
      clc         
      adc #$07
      tax
      ldy #$02    
      bne FBallB  

GetMiscBoundBox:
        txa                       
        clc                       
        adc #$09
        tax
        ldy #$06                  
FBallB: jsr BoundingBoxCore       
        jmp CheckRightScreenBBox  

GetEnemyBoundBox:
      ldy #$48                 
      sty $00
      ldy #$44                 
      jmp GetMaskedOffScrBits

SmallPlatformBoundBox:
      ldy #$08                 
      sty $00
      ldy #$04                 

GetMaskedOffScrBits:
        lda Enemy_X_Position,x      
        sec                         
        sbc ScreenLeft_X_Pos
        sta $01                     
        lda Enemy_PageLoc,x         
        sbc ScreenLeft_PageLoc      
        bmi CMBits                  
        ora $01
        beq CMBits                  
        ldy $00                     
CMBits: tya                         
        and Enemy_OffscreenBits     
        sta EnemyOffscrBitsMasked,x 
        bne MoveBoundBoxOffscreen   
        jmp SetupEOffsetFBBox       

LargePlatformBoundBox:
      inx                        
      jsr GetXOffscreenBits      
      dex                        
      cmp #$fe                   
      bcs MoveBoundBoxOffscreen  

SetupEOffsetFBBox:
      txa                        
      clc                        
      adc #$01
      tax
      ldy #$01                   
      jsr BoundingBoxCore        
      jmp CheckRightScreenBBox   

MoveBoundBoxOffscreen:
      txa                            
      asl
      asl
      tay                            
      lda #$ff
      sta EnemyBoundingBoxCoord,y    
      sta EnemyBoundingBoxCoord+1,y
      sta EnemyBoundingBoxCoord+2,y
      sta EnemyBoundingBoxCoord+3,y
      rts

BoundingBoxCore:
      stx $00                     
      lda SprObject_Rel_YPos,y    
      sta $02                     
      lda SprObject_Rel_XPos,y
      sta $01
      txa                         
      asl
      asl
      pha
      tay                         
      lda SprObj_BoundBoxCtrl,x   
      asl                         
      asl
      tax
      lda $01                     
      clc                         
      adc BoundBoxCtrlData,x      
      sta BoundingBox_UL_Corner,y 
      lda $01
      clc
      adc BoundBoxCtrlData+2,x    
      sta BoundingBox_LR_Corner,y 
      inx                         
      iny
      lda $02                     
      clc                         
      adc BoundBoxCtrlData,x      
      sta BoundingBox_UL_Corner,y
      lda $02
      clc
      adc BoundBoxCtrlData+2,x    
      sta BoundingBox_LR_Corner,y 
      pla                         
      tay                         
      ldx $00                     
      rts

CheckRightScreenBBox:
       lda ScreenLeft_X_Pos       
       clc                        
       adc #$80
       sta $02
       lda ScreenLeft_PageLoc     
       adc #$00                   
       sta $01
       lda SprObject_X_Position,x 
       cmp $02                    
       lda SprObject_PageLoc,x    
       sbc $01                    
       bcc CheckLeftScreenBBox    
       lda BoundingBox_DR_XPos,y  
       bmi NoOfs                  
       lda #$ff                   
       ldx BoundingBox_UL_XPos,y  
       bmi SORte                  
       sta BoundingBox_UL_XPos,y  
SORte: sta BoundingBox_DR_XPos,y  
NoOfs: ldx ObjectOffset           
       rts

CheckLeftScreenBBox:
        lda BoundingBox_UL_XPos,y  
        bpl NoOfs2                 
        cmp #$a0                   
        bcc NoOfs2                 
        lda #$00
        ldx BoundingBox_DR_XPos,y  
        bpl SOLft                  
        sta BoundingBox_DR_XPos,y  
SOLft:  sta BoundingBox_UL_XPos,y  
NoOfs2: ldx ObjectOffset           
        rts





PlayerCollisionCore:
      ldx #$00     

SprObjectCollisionCore:
      sty $06      
      lda #$01
      sta $07      

CollisionCoreLoop:
      lda BoundingBox_UL_Corner,y  
      cmp BoundingBox_UL_Corner,x  
      bcs FirstBoxGreater          
      cmp BoundingBox_LR_Corner,x  
      bcc SecondBoxVerticalChk     
      beq CollisionFound           
      lda BoundingBox_LR_Corner,y  
      cmp BoundingBox_UL_Corner,y  
      bcc CollisionFound           
      cmp BoundingBox_UL_Corner,x  
      bcs CollisionFound           
      ldy $06                      
      rts                          

SecondBoxVerticalChk:
      lda BoundingBox_LR_Corner,x  
      cmp BoundingBox_UL_Corner,x  
      bcc CollisionFound           
      lda BoundingBox_LR_Corner,y  
      cmp BoundingBox_UL_Corner,x  
      bcs CollisionFound           
      ldy $06                      
      rts

FirstBoxGreater:
      cmp BoundingBox_UL_Corner,x  
      beq CollisionFound           
      cmp BoundingBox_LR_Corner,x  
      bcc CollisionFound           
      beq CollisionFound           
      cmp BoundingBox_LR_Corner,y  
      bcc NoCollisionFound         
      beq NoCollisionFound
      lda BoundingBox_LR_Corner,y  
      cmp BoundingBox_UL_Corner,x  
      bcs CollisionFound           

NoCollisionFound:
      clc          
      ldy $06      
      rts          

CollisionFound:
      inx                    
      iny                    
      dec $07                
      bpl CollisionCoreLoop  
      sec                    
      ldy $06                
      rts








BlockBufferChk_Enemy:
      pha        
      txa
      clc        
      adc #$01
      tax
      pla        
      jmp BBChk_E

ResidualMiscObjectCode:
      txa
      clc           
      adc #$0d      
      tax
      ldy #$1b      
      jmp ResJmpM   

BlockBufferChk_FBall:
         ldy #$1a                  
         txa
         clc
         adc #$07                  
         tax
ResJmpM: lda #$00                  
BBChk_E: jsr BlockBufferCollision  
         ldx ObjectOffset          
         cmp #$00                  
         rts

BlockBufferAdderData:


BlockBuffer_X_Adder:





BlockBuffer_Y_Adder:





BlockBufferColli_Feet:
       iny            

BlockBufferColli_Head:
       lda #$00       


BlockBufferColli_Side:
       lda #$01       
       ldx #$00       

BlockBufferCollision:
       pha                         
       sty $04                     
       lda BlockBuffer_X_Adder,y   
       clc                         
       adc SprObject_X_Position,x
       sta $05                     
       lda SprObject_PageLoc,x
       adc #$00                    
       and #$01                    
       lsr                         
       ora $05                     
       ror                         
       lsr                         
       lsr                         
       lsr                         
       jsr GetBlockBufferAddr      
       ldy $04                     
       lda SprObject_Y_Position,x  
       clc
       adc BlockBuffer_Y_Adder,y   
       and #%11110000              
       sec
       sbc #$20                    
       sta $02                     
       tay                         
       lda ($06),y                 
       sta $03                     
       ldy $04                     
       pla                         
       bne RetXC                   
       lda SprObject_Y_Position,x  
       jmp RetYC                   
RetXC: lda SprObject_X_Position,x  
RetYC: and #%00001111              
       sta $04                     
       lda $03                     
       rts                         






VineYPosAdder:


DrawVine:
         sty $00                    
         lda Enemy_Rel_YPos         
         clc
         adc VineYPosAdder,y        
         ldx VineObjOffset,y        
         ldy Enemy_SprDataOffset,x  
         sty $02                    
         jsr SixSpriteStacker       
         lda Enemy_Rel_XPos         
         sta Sprite_X_Position,y    
         sta Sprite_X_Position+8,y
         sta Sprite_X_Position+16,y
         clc
         adc #$06                   
         sta Sprite_X_Position+4,y  
         sta Sprite_X_Position+12,y 
         sta Sprite_X_Position+20,y
         lda #%00100001             
         sta Sprite_Attributes,y    
         sta Sprite_Attributes+8,y
         sta Sprite_Attributes+16,y
         ora #%01000000             
         sta Sprite_Attributes+4,y  
         sta Sprite_Attributes+12,y
         sta Sprite_Attributes+20,y
         ldx #$05                   
VineTL:  lda #$e1                   
         sta Sprite_Tilenumber,y
         iny                        
         iny
         iny
         iny
         dex                        
         bpl VineTL                 
         ldy $02                    
         lda $00                    
         bne SkpVTop                
         lda #$e0
         sta Sprite_Tilenumber,y    
SkpVTop: ldx #$00                   
ChkFTop: lda VineStart_Y_Position   
         sec
         sbc Sprite_Y_Position,y    
         cmp #$64                   
         bcc NextVSp                
         lda #$f8
         sta Sprite_Y_Position,y    
NextVSp: iny                        
         iny
         iny
         iny
         inx                        
         cpx #$06                   
         bne ChkFTop
         ldy $00                    
         rts

SixSpriteStacker:
       ldx #$06           
StkLp: sta Sprite_Data,y  
       clc
       adc #$08           
       iny
       iny                
       iny
       iny
       dex                
       bne StkLp          
       ldy $02            
       rts



FirstSprXPos:


FirstSprYPos:


SecondSprXPos:


SecondSprYPos:


FirstSprTilenum:


SecondSprTilenum:


HammerSprAttrib:


DrawHammer:
            ldy Misc_SprDataOffset,x    
            lda TimerControl
            bne ForceHPose              
            lda Misc_State,x            
            and #%01111111              
            cmp #$01                    
            beq GetHPose                
ForceHPose: ldx #$00                    
            beq RenderH                 
GetHPose:   lda FrameCounter            
            lsr                         
            lsr
            and #%00000011              
            tax                         
RenderH:    lda Misc_Rel_YPos           
            clc
            adc FirstSprYPos,x          
            sta Sprite_Y_Position,y     
            clc
            adc SecondSprYPos,x         
            sta Sprite_Y_Position+4,y   
            lda Misc_Rel_XPos           
            clc
            adc FirstSprXPos,x          
            sta Sprite_X_Position,y     
            clc
            adc SecondSprXPos,x         
            sta Sprite_X_Position+4,y   
            lda FirstSprTilenum,x
            sta Sprite_Tilenumber,y     
            lda SecondSprTilenum,x
            sta Sprite_Tilenumber+4,y   
            lda HammerSprAttrib,x
            sta Sprite_Attributes,y     
            sta Sprite_Attributes+4,y   
            ldx ObjectOffset            
            lda Misc_OffscreenBits
            and #%11111100              
            beq NoHOffscr               
            lda #$00
            sta Misc_State,x            
            lda #$f8
            jsr DumpTwoSpr              
NoHOffscr:  rts                         








FlagpoleScoreNumTiles:






FlagpoleGfxHandler:
      ldy Enemy_SprDataOffset,x      
      lda Enemy_Rel_XPos             
      sta Sprite_X_Position,y        
      clc
      adc #$08                       
      sta Sprite_X_Position+4,y      
      sta Sprite_X_Position+8,y
      clc
      adc #$0c                       
      sta $05                        
      lda Enemy_Y_Position,x         
      jsr DumpTwoSpr                 
      adc #$08                       
      sta Sprite_Y_Position+8,y      
      lda FlagpoleFNum_Y_Pos         
      sta $02                        
      lda #$01
      sta $03                        
      sta $04                        
      sta Sprite_Attributes,y        
      sta Sprite_Attributes+4,y
      sta Sprite_Attributes+8,y
      lda #$7e
      sta Sprite_Tilenumber,y        
      sta Sprite_Tilenumber+8,y      
      lda #$7f
      sta Sprite_Tilenumber+4,y      
      lda FlagpoleCollisionYPos      
      beq ChkFlagOffscreen           
      tya
      clc                            
      adc #$0c
      tay                            
      lda FlagpoleScore              
      asl                            
      tax
      lda FlagpoleScoreNumTiles,x    
      sta $00
      lda FlagpoleScoreNumTiles+1,x
      jsr DrawOneSpriteRow           

ChkFlagOffscreen:
      ldx ObjectOffset               
      ldy Enemy_SprDataOffset,x      
      lda Enemy_OffscreenBits        
      and #%00001110                 
      beq ExitDumpSpr                



MoveSixSpritesOffscreen:
      lda #$f8                  

DumpSixSpr:
      sta Sprite_Data+20,y      
      sta Sprite_Data+16,y      

DumpFourSpr:
      sta Sprite_Data+12,y      

DumpThreeSpr:
      sta Sprite_Data+8,y

DumpTwoSpr:
      sta Sprite_Data+4,y       
      sta Sprite_Data,y

ExitDumpSpr:
      rts



DrawLargePlatform:
      ldy Enemy_SprDataOffset,x   
      sty $02                     
      iny                         
      iny                         
      iny
      lda Enemy_Rel_XPos          
      jsr SixSpriteStacker        
      ldx ObjectOffset
      lda Enemy_Y_Position,x      
      jsr DumpFourSpr             
      ldy AreaType
      cpy #$03                    
      beq ShrinkPlatform
      ldy SecondaryHardMode       
      beq SetLast2Platform        

ShrinkPlatform:
      lda #$f8                    

SetLast2Platform:
      ldy Enemy_SprDataOffset,x   
      sta Sprite_Y_Position+16,y  
      sta Sprite_Y_Position+20,y  
      lda #$5b                    
      ldx CloudTypeOverride
      beq SetPlatformTilenum      
      lda #$75                    

SetPlatformTilenum:
        ldx ObjectOffset            
        iny                         
        jsr DumpSixSpr              
        lda #$02                    
        iny                         
        jsr DumpSixSpr              
        inx                         
        jsr GetXOffscreenBits       
        dex
        ldy Enemy_SprDataOffset,x   
        asl                         
        pha                         
        bcc SChk2
        lda #$f8                    
        sta Sprite_Y_Position,y
SChk2:  pla                         
        asl                         
        pha                         
        bcc SChk3
        lda #$f8                    
        sta Sprite_Y_Position+4,y
SChk3:  pla                         
        asl                         
        pha                         
        bcc SChk4
        lda #$f8                    
        sta Sprite_Y_Position+8,y
SChk4:  pla                         
        asl                         
        pha                         
        bcc SChk5
        lda #$f8                    
        sta Sprite_Y_Position+12,y
SChk5:  pla                         
        asl                         
        pha                         
        bcc SChk6
        lda #$f8                    
        sta Sprite_Y_Position+16,y
SChk6:  pla                         
        asl                         
        bcc SLChk                   
        lda #$f8
        sta Sprite_Y_Position+20,y  
SLChk:  lda Enemy_OffscreenBits     
        asl                         
        bcc ExDLPl
        jsr MoveSixSpritesOffscreen 
ExDLPl: rts



DrawFloateyNumber_Coin:
          lda FrameCounter          
          lsr                       
          bcs NotRsNum              
          dec Misc_Y_Position,x     
NotRsNum: lda Misc_Y_Position,x     
          jsr DumpTwoSpr            
          lda Misc_Rel_XPos         
          sta Sprite_X_Position,y   
          clc
          adc #$08                  
          sta Sprite_X_Position+4,y 
          lda #$02
          sta Sprite_Attributes,y   
          sta Sprite_Attributes+4,y
          lda #$f7
          sta Sprite_Tilenumber,y   
          lda #$fb                  
          sta Sprite_Tilenumber+4,y
          jmp ExJCGfx               

JumpingCoinTiles:


JCoinGfxHandler:
         ldy Misc_SprDataOffset,x    
         lda Misc_State,x            
         cmp #$02                    
         bcs DrawFloateyNumber_Coin  
         lda Misc_Y_Position,x       
         sta Sprite_Y_Position,y     
         clc
         adc #$08                    
         sta Sprite_Y_Position+4,y   
         lda Misc_Rel_XPos           
         sta Sprite_X_Position,y
         sta Sprite_X_Position+4,y   
         lda FrameCounter            
         lsr                         
         and #%00000011              
         tax                         
         lda JumpingCoinTiles,x      
         iny                         
         jsr DumpTwoSpr              
         dey                         
         lda #$02
         sta Sprite_Attributes,y     
         lda #$82
         sta Sprite_Attributes+4,y   
         ldx ObjectOffset            
ExJCGfx: rts                         










PowerUpGfxTable:





PowerUpAttributes:


DrawPowerUp:
      ldy Enemy_SprDataOffset+5  
      lda Enemy_Rel_YPos         
      clc
      adc #$08                   
      sta $02                    
      lda Enemy_Rel_XPos         
      sta $05                    
      ldx PowerUpType            
      lda PowerUpAttributes,x    
      ora Enemy_SprAttrib+5      
      sta $04                    
      txa
      pha                        
      asl
      asl                        
      tax                        
      lda #$01
      sta $07                    
      sta $03                    

PUpDrawLoop:
        lda PowerUpGfxTable,x      
        sta $00
        lda PowerUpGfxTable+1,x    
        jsr DrawOneSpriteRow       
        dec $07                    
        bpl PUpDrawLoop            
        ldy Enemy_SprDataOffset+5  
        pla                        
        beq PUpOfs                 
        cmp #$03
        beq PUpOfs                 
        sta $00                    
        lda FrameCounter           
        lsr                        
        and #%00000011             
        ora Enemy_SprAttrib+5      
        sta Sprite_Attributes,y    
        sta Sprite_Attributes+4,y  
        ldx $00
        dex                        
        beq FlipPUpRightSide       
        sta Sprite_Attributes+8,y  
        sta Sprite_Attributes+12,y 

FlipPUpRightSide:
        lda Sprite_Attributes+4,y
        ora #%01000000             
        sta Sprite_Attributes+4,y
        lda Sprite_Attributes+12,y
        ora #%01000000             
        sta Sprite_Attributes+12,y 
PUpOfs: jmp SprObjectOffscrChk     













EnemyGraphicsTable:












































EnemyGfxTableOffsets:





EnemyAttributeData:





EnemyAnimTimingBMask:


JumpspringFrameOffsets:


EnemyGfxHandler:
      lda Enemy_Y_Position,x      
      sta $02
      lda Enemy_Rel_XPos          
      sta $05                     
      ldy Enemy_SprDataOffset,x
      sty $eb                     
      lda #$00
      sta VerticalFlipFlag        
      lda Enemy_MovingDir,x
      sta $03                     
      lda Enemy_SprAttrib,x
      sta $04                     
      lda Enemy_ID,x
      cmp #PiranhaPlant           
      bne CheckForRetainerObj     
      ldy PiranhaPlant_Y_Speed,x
      bmi CheckForRetainerObj     
      ldy EnemyFrameTimer,x
      beq CheckForRetainerObj     
      rts                         

CheckForRetainerObj:
      lda Enemy_State,x           
      sta $ed
      and #%00011111              
      tay
      lda Enemy_ID,x              
      cmp #RetainerObject
      bne CheckForBulletBillCV    
      ldy #$00                    
      lda #$01                    
      sta $03
      lda #$15                    

CheckForBulletBillCV:
       cmp #BulletBill_CannonVar   
       bne CheckForJumpspring      
       dec $02                     
       lda #$03
       ldy EnemyFrameTimer,x       
       beq SBBAt                   
       ora #%00100000              
SBBAt: sta $04                     
       ldy #$00                    
       sty $ed                     
       lda #$08                    

CheckForJumpspring:
      cmp #JumpspringObject        
      bne CheckForPodoboo
      ldy #$03                     
      ldx JumpspringAnimCtrl       
      lda JumpspringFrameOffsets,x 

CheckForPodoboo:
      sta $ef                 
      sty $ec                 
      ldx ObjectOffset        
      cmp #$0c                
      bne CheckBowserGfxFlag  
      lda Enemy_Y_Speed,x     
      bmi CheckBowserGfxFlag
      inc VerticalFlipFlag    

CheckBowserGfxFlag:
             lda BowserGfxFlag   
             beq CheckForGoomba
             ldy #$16            
             cmp #$01
             beq SBwsrGfxOfs
             iny                 
SBwsrGfxOfs: sty $ef

CheckForGoomba:
          ldy $ef               
          cpy #Goomba
          bne CheckBowserFront  
          lda Enemy_State,x
          cmp #$02              
          bcc GmbaAnim          
          ldx #$04              
          stx $ec
GmbaAnim: and #%00100000        
          ora TimerControl      
          bne CheckBowserFront  
          lda FrameCounter
          and #%00001000        
          bne CheckBowserFront
          lda $03
          eor #%00000011        
          sta $03               

CheckBowserFront:
             lda EnemyAttributeData,y    
             ora $04                     
             sta $04
             lda EnemyGfxTableOffsets,y  
             tax                         
             ldy $ec                     
             lda BowserGfxFlag
             beq CheckForSpiny           
             cmp #$01
             bne CheckBowserRear         
             lda BowserBodyControls      
             bpl ChkFrontSte             
             ldx #$de                    
ChkFrontSte: lda $ed                     
             and #%00100000              
             beq DrawBowser

FlipBowserOver:
      stx VerticalFlipFlag  

DrawBowser:
      jmp DrawEnemyObject   

CheckBowserRear:
            lda BowserBodyControls  
            and #$01
            beq ChkRearSte          
            ldx #$e4                
ChkRearSte: lda $ed                 
            and #%00100000          
            beq DrawBowser
            lda $02                 
            sec                     
            sbc #$10
            sta $02
            jmp FlipBowserOver      

CheckForSpiny:
        cpx #$24               
        bne CheckForLakitu     
        cpy #$05               
        bne NotEgg             
        ldx #$30               
        lda #$02
        sta $03                
        lda #$05
        sta $ec                
NotEgg: jmp CheckForHammerBro  

CheckForLakitu:
        cpx #$90                  
        bne CheckUpsideDownShell  
        lda $ed
        and #%00100000            
        bne NoLAFr                
        lda FrenzyEnemyTimer
        cmp #$10                  
        bcs NoLAFr                
        ldx #$96                  
NoLAFr: jmp CheckDefeatedState    

CheckUpsideDownShell:
      lda $ef                    
      cmp #$04
      bcs CheckRightSideUpShell  
      cpy #$02
      bcc CheckRightSideUpShell  
      ldx #$5a                   
      ldy $ef
      cpy #BuzzyBeetle           
      bne CheckRightSideUpShell
      ldx #$7e                   
      inc $02                    

CheckRightSideUpShell:
      lda $ec                
      cmp #$04               
      bne CheckForHammerBro  
      ldx #$72               
      inc $02                
      ldy $ef
      cpy #BuzzyBeetle       
      beq CheckForDefdGoomba 
      ldx #$66               
      inc $02                

CheckForDefdGoomba:
      cpy #Goomba            
      bne CheckForHammerBro  
      ldx #$54               
      lda $ed                
      and #%00100000         
      bne CheckForHammerBro  
      ldx #$8a               
      dec $02                

CheckForHammerBro:
      ldy ObjectOffset
      lda $ef                  
      cmp #HammerBro
      bne CheckForBloober      
      lda $ed
      beq CheckToAnimateEnemy  
      and #%00001000
      beq CheckDefeatedState   
      ldx #$b4                 
      bne CheckToAnimateEnemy  

CheckForBloober:
      cpx #$48                 
      beq CheckToAnimateEnemy  
      lda EnemyIntervalTimer,y
      cmp #$05
      bcs CheckDefeatedState   
      cpx #$3c                 
      bne CheckToAnimateEnemy  
      cmp #$01
      beq CheckDefeatedState   
      inc $02                  
      inc $02
      inc $02
      jmp CheckAnimationStop   

CheckToAnimateEnemy:
      lda $ef                  
      cmp #Goomba
      beq CheckDefeatedState   
      cmp #$08
      beq CheckDefeatedState   
      cmp #Podoboo
      beq CheckDefeatedState   
      cmp #$18                 
      bcs CheckDefeatedState
      ldy #$00    
      cmp #$15                 
      bne CheckForSecondFrame  
      iny                      
      lda WorldNumber          
      cmp #World8
      bcs CheckDefeatedState   
      ldx #$a2                 
      lda #$03                 
      sta $ec
      bne CheckDefeatedState   

CheckForSecondFrame:
      lda FrameCounter            
      and EnemyAnimTimingBMask,y  
      bne CheckDefeatedState      

CheckAnimationStop:
      lda $ed                 
      and #%10100000          
      ora TimerControl
      bne CheckDefeatedState  
      txa
      clc
      adc #$06                
      tax                     

CheckDefeatedState:
      lda $ed               
      and #%00100000        
      beq DrawEnemyObject   
      lda $ef
      cmp #$04              
      bcc DrawEnemyObject   
      ldy #$01
      sty VerticalFlipFlag  
      dey
      sty $ec               

DrawEnemyObject:
      ldy $eb                    
      jsr DrawEnemyObjRow        
      jsr DrawEnemyObjRow        
      jsr DrawEnemyObjRow
      ldx ObjectOffset           
      ldy Enemy_SprDataOffset,x  
      lda $ef
      cmp #$08                   
      bne CheckForVerticalFlip   

SkipToOffScrChk:
      jmp SprObjectOffscrChk     

CheckForVerticalFlip:
      lda VerticalFlipFlag       
      beq CheckForESymmetry      
      lda Sprite_Attributes,y    
      ora #%10000000             
      iny
      iny                        
      jsr DumpSixSpr             
      dey
      dey                        
      tya
      tax                        
      lda $ef
      cmp #HammerBro             
      beq FlipEnemyVertically
      cmp #Lakitu                
      beq FlipEnemyVertically    
      cmp #$15
      bcs FlipEnemyVertically    
      txa
      clc
      adc #$08                   
      tax                        

FlipEnemyVertically:
      lda Sprite_Tilenumber,x     
      pha                         
      lda Sprite_Tilenumber+4,x
      pha
      lda Sprite_Tilenumber+16,y  
      sta Sprite_Tilenumber,x     
      lda Sprite_Tilenumber+20,y
      sta Sprite_Tilenumber+4,x
      pla                         
      sta Sprite_Tilenumber+20,y  
      pla
      sta Sprite_Tilenumber+16,y

CheckForESymmetry:
        lda BowserGfxFlag           
        bne SkipToOffScrChk         
        lda $ef       
        ldx $ec                     
        cmp #$05                    
        bne ContES
        jmp SprObjectOffscrChk      
ContES: cmp #Bloober                
        beq MirrorEnemyGfx
        cmp #PiranhaPlant           
        beq MirrorEnemyGfx
        cmp #Podoboo                
        beq MirrorEnemyGfx          
        cmp #Spiny                  
        bne ESRtnr                  
        cpx #$05                    
        bne CheckToMirrorLakitu     
ESRtnr: cmp #$15                    
        bne SpnySC
        lda #$42                    
        sta Sprite_Attributes+20,y  
SpnySC: cpx #$02                    
        bcc CheckToMirrorLakitu

MirrorEnemyGfx:
        lda BowserGfxFlag           
        bne CheckToMirrorLakitu
        lda Sprite_Attributes,y     
        and #%10100011
        sta Sprite_Attributes,y     
        sta Sprite_Attributes+8,y   
        sta Sprite_Attributes+16,y
        ora #%01000000              
        cpx #$05                    
        bne EggExc                  
        ora #%10000000              
EggExc: sta Sprite_Attributes+4,y   
        sta Sprite_Attributes+12,y  
        sta Sprite_Attributes+20,y
        cpx #$04                    
        bne CheckToMirrorLakitu     
        lda Sprite_Attributes+8,y   
        ora #%10000000
        sta Sprite_Attributes+8,y   
        sta Sprite_Attributes+16,y  
        ora #%01000000
        sta Sprite_Attributes+12,y  
        sta Sprite_Attributes+20,y  

CheckToMirrorLakitu:
        lda $ef                     
        cmp #Lakitu
        bne CheckToMirrorJSpring    
        lda VerticalFlipFlag
        bne NVFLak                  
        lda Sprite_Attributes+16,y  
        and #%10000001              
        sta Sprite_Attributes+16,y
        lda Sprite_Attributes+20,y  
        ora #%01000001              
        sta Sprite_Attributes+20,y
        ldx FrenzyEnemyTimer        
        cpx #$10
        bcs SprObjectOffscrChk      
        sta Sprite_Attributes+12,y  
        and #%10000001
        sta Sprite_Attributes+8,y   
        bcc SprObjectOffscrChk      
NVFLak: lda Sprite_Attributes,y     
        and #%10000001
        sta Sprite_Attributes,y     
        lda Sprite_Attributes+4,y   
        ora #%01000001              
        sta Sprite_Attributes+4,y   

CheckToMirrorJSpring:
      lda $ef                     
      cmp #$18
      bcc SprObjectOffscrChk      
      lda #$82
      sta Sprite_Attributes+8,y   
      sta Sprite_Attributes+16,y  
      ora #%01000000
      sta Sprite_Attributes+12,y  
      sta Sprite_Attributes+20,y  

SprObjectOffscrChk:
         ldx ObjectOffset          
         lda Enemy_OffscreenBits   
         lsr
         lsr                       
         lsr                       
         pha                       
         bcc LcChk                 
         lda #$04                  
         jsr MoveESprColOffscreen  
LcChk:   pla                       
         lsr                       
         pha                       
         bcc Row3C                 
         lda #$00                  
         jsr MoveESprColOffscreen  
Row3C:   pla                       
         lsr                       
         lsr
         pha                       
         bcc Row23C                
         lda #$10                  
         jsr MoveESprRowOffscreen  
Row23C:  pla                       
         lsr                       
         pha                       
         bcc AllRowC
         lda #$08                  
         jsr MoveESprRowOffscreen  
AllRowC: pla                       
         lsr                       
         bcc ExEGHandler
         jsr MoveESprRowOffscreen  
         lda Enemy_ID,x
         cmp #Podoboo              
         beq ExEGHandler           
         lda Enemy_Y_HighPos,x     
         cmp #$02                  
         bne ExEGHandler
         jsr EraseEnemyObject      

ExEGHandler:
      rts

DrawEnemyObjRow:
      lda EnemyGraphicsTable,x    
      sta $00
      lda EnemyGraphicsTable+1,x

DrawOneSpriteRow:
      sta $01
      jmp DrawSpriteObject        

MoveESprRowOffscreen:
      clc                         
      adc Enemy_SprDataOffset,x
      tay                         
      lda #$f8
      jmp DumpTwoSpr              

MoveESprColOffscreen:
      clc                         
      adc Enemy_SprDataOffset,x
      tay                         
      jsr MoveColOffscreen        
      sta Sprite_Data+16,y        
      rts








DefaultBlockObjTiles:


DrawBlock:
           lda Block_Rel_YPos            
           sta $02                       
           lda Block_Rel_XPos            
           sta $05                       
           lda #$03
           sta $04                       
           lsr
           sta $03                       
           ldy Block_SprDataOffset,x     
           ldx #$00                      
DBlkLoop:  lda DefaultBlockObjTiles,x    
           sta $00                       
           lda DefaultBlockObjTiles+1,x  
           jsr DrawOneSpriteRow          
           cpx #$04                      
           bne DBlkLoop                  
           ldx ObjectOffset              
           ldy Block_SprDataOffset,x     
           lda AreaType
           cmp #$01                      
           beq ChkRep                    
           lda #$86
           sta Sprite_Tilenumber,y       
           sta Sprite_Tilenumber+4,y     
ChkRep:    lda Block_Metatile,x          
           cmp #$c4                      
           bne BlkOffscr                 
           lda #$87                      
           iny                           
           jsr DumpFourSpr               
           dey                           
           lda #$03                      
           ldx AreaType
           dex                           
           beq SetBFlip                  
           lsr                           
SetBFlip:  ldx ObjectOffset              
           sta Sprite_Attributes,y       
           ora #%01000000
           sta Sprite_Attributes+4,y     
           ora #%10000000
           sta Sprite_Attributes+12,y    
           and #%10000011
           sta Sprite_Attributes+8,y     
BlkOffscr: lda Block_OffscreenBits       
           pha                           
           and #%00000100                
           beq PullOfsB                  
           lda #$f8                      
           sta Sprite_Y_Position+4,y     
           sta Sprite_Y_Position+12,y
PullOfsB:  pla                           
ChkLeftCo: and #%00001000                
           beq ExDBlk                    

MoveColOffscreen:
        lda #$f8                   
        sta Sprite_Y_Position,y    
        sta Sprite_Y_Position+8,y  
ExDBlk: rts




DrawBrickChunks:
         lda #$02                   
         sta $00
         lda #$75                   
         ldy GameEngineSubroutine
         cpy #$05                   
         beq DChunks                
         lda #$03                   
         sta $00
         lda #$84                   
DChunks: ldy Block_SprDataOffset,x  
         iny                        
         jsr DumpFourSpr            
         lda FrameCounter           
         asl
         asl
         asl                        
         asl
         and #$c0                   
         ora $00                    
         iny                        
         jsr DumpFourSpr            
         dey
         dey                        
         lda Block_Rel_YPos         
         jsr DumpTwoSpr             
         lda Block_Rel_XPos         
         sta Sprite_X_Position,y    
         lda Block_Orig_XPos,x      
         sec
         sbc ScreenLeft_X_Pos       
         sta $00                    
         sec
         sbc Block_Rel_XPos         
         adc $00                    
         adc #$06                   
         sta Sprite_X_Position+4,y  
         lda Block_Rel_YPos+1       
         sta Sprite_Y_Position+8,y
         sta Sprite_Y_Position+12,y 
         lda Block_Rel_XPos+1       
         sta Sprite_X_Position+8,y  
         lda $00                    
         sec
         sbc Block_Rel_XPos+1       
         adc $00                    
         adc #$06                   
         sta Sprite_X_Position+12,y 
         lda Block_OffscreenBits    
         jsr ChkLeftCo              
         lda Block_OffscreenBits    
         asl                        
         bcc ChnkOfs                
         lda #$f8
         jsr DumpTwoSpr             
ChnkOfs: lda $00                    
         bpl ExBCDr                 
         lda Sprite_X_Position,y    
         cmp Sprite_X_Position+4,y  
         bcc ExBCDr                 
         lda #$f8                   
         sta Sprite_Y_Position+4,y
         sta Sprite_Y_Position+12,y
ExBCDr:  rts                        



DrawFireball:
      ldy FBall_SprDataOffset,x  
      lda Fireball_Rel_YPos      
      sta Sprite_Y_Position,y    
      lda Fireball_Rel_XPos      
      sta Sprite_X_Position,y    

DrawFirebar:
       lda FrameCounter         
       lsr                      
       lsr
       pha                      
       and #$01                 
       eor #$64                 
       sta Sprite_Tilenumber,y  
       pla                      
       lsr                      
       lsr
       lda #$02                 
       bcc FireA                
       ora #%11000000           
FireA: sta Sprite_Attributes,y  
       rts



ExplosionTiles:


DrawExplosion_Fireball:
      ldy Alt_SprDataOffset,x  
      lda Fireball_State,x     
      inc Fireball_State,x     
      lsr                      
      and #%00000111           
      cmp #$03                 
      bcs KillFireBall         

DrawExplosion_Fireworks:
      tax                         
      lda ExplosionTiles,x        
      iny                         
      jsr DumpFourSpr             
      dey                         
      ldx ObjectOffset            
      lda Fireball_Rel_YPos       
      sec                         
      sbc #$04                    
      sta Sprite_Y_Position,y
      sta Sprite_Y_Position+8,y
      clc                         
      adc #$08                    
      sta Sprite_Y_Position+4,y
      sta Sprite_Y_Position+12,y
      lda Fireball_Rel_XPos       
      sec                         
      sbc #$04                    
      sta Sprite_X_Position,y
      sta Sprite_X_Position+4,y
      clc                         
      adc #$08                    
      sta Sprite_X_Position+8,y
      sta Sprite_X_Position+12,y
      lda #$02                    
      sta Sprite_Attributes,y     
      lda #$82
      sta Sprite_Attributes+4,y   
      lda #$42
      sta Sprite_Attributes+8,y   
      lda #$c2
      sta Sprite_Attributes+12,y  
      rts                         

KillFireBall:
      lda #$00                    
      sta Fireball_State,x
      rts



DrawSmallPlatform:
       ldy Enemy_SprDataOffset,x   
       lda #$5b                    
       iny                         
       jsr DumpSixSpr              
       iny                         
       lda #$02                    
       jsr DumpSixSpr              
       dey                         
       dey
       lda Enemy_Rel_XPos          
       sta Sprite_X_Position,y
       sta Sprite_X_Position+12,y  
       clc
       adc #$08                    
       sta Sprite_X_Position+4,y   
       sta Sprite_X_Position+16,y
       clc
       adc #$08                    
       sta Sprite_X_Position+8,y   
       sta Sprite_X_Position+20,y
       lda Enemy_Y_Position,x      
       tax
       pha                         
       cpx #$20                    
       bcs TopSP                   
       lda #$f8                    
TopSP: jsr DumpThreeSpr            
       pla                         
       clc
       adc #$80                    
       tax
       cpx #$20                    
       bcs BotSP                   
       lda #$f8                    
BotSP: sta Sprite_Y_Position+12,y  
       sta Sprite_Y_Position+16,y  
       sta Sprite_Y_Position+20,y
       lda Enemy_OffscreenBits     
       pha                         
       and #%00001000              
       beq SOfs
       lda #$f8                    
       sta Sprite_Y_Position,y     
       sta Sprite_Y_Position+12,y
SOfs:  pla                         
       pha
       and #%00000100              
       beq SOfs2
       lda #$f8                    
       sta Sprite_Y_Position+4,y   
       sta Sprite_Y_Position+16,y
SOfs2: pla                         
       and #%00000010              
       beq ExSPl
       lda #$f8                    
       sta Sprite_Y_Position+8,y   
       sta Sprite_Y_Position+20,y
ExSPl: ldx ObjectOffset            
       rts



DrawBubble:
        ldy Player_Y_HighPos        
        dey                         
        bne ExDBub
        lda Bubble_OffscreenBits    
        and #%00001000
        bne ExDBub                  
        ldy Bubble_SprDataOffset,x  
        lda Bubble_Rel_XPos         
        sta Sprite_X_Position,y     
        lda Bubble_Rel_YPos         
        sta Sprite_Y_Position,y     
        lda #$74
        sta Sprite_Tilenumber,y     
        lda #$02
        sta Sprite_Attributes,y     
ExDBub: rts                         




PlayerGfxTblOffsets:





PlayerGraphicsTable:



























SwimKickTileNum:


PlayerGfxHandler:
        lda InjuryTimer             
        beq CntPl                   
        lda FrameCounter
        lsr                         
        bcs ExPGH                   
CntPl:  lda GameEngineSubroutine    
        cmp #$0b                    
        beq PlayerKilled
        lda PlayerChangeSizeFlag    
        bne DoChangeSize            
        ldy SwimmingFlag            
        beq FindPlayerAction        
        lda Player_State
        cmp #$00                    
        beq FindPlayerAction        
        jsr FindPlayerAction        
        lda FrameCounter
        and #%00000100              
        bne ExPGH                   
        tax                         
        ldy Player_SprDataOffset    
        lda PlayerFacingDir         
        lsr
        bcs SwimKT                  
        iny
        iny                         
        iny
        iny
SwimKT: lda PlayerSize              
        beq BigKTS                  
        lda Sprite_Tilenumber+24,y  
        cmp SwimTileRepOffset       
        beq ExPGH                   
        inx                         
BigKTS: lda SwimKickTileNum,x       
        sta Sprite_Tilenumber+24,y  
ExPGH:  rts                         

FindPlayerAction:
      jsr ProcessPlayerAction       
      jmp PlayerGfxProcessing       

DoChangeSize:
      jsr HandleChangeSize          
      jmp PlayerGfxProcessing       

PlayerKilled:
      ldy #$0e                      
      lda PlayerGfxTblOffsets,y     

PlayerGfxProcessing:
       sta PlayerGfxOffset           
       lda #$04
       jsr RenderPlayerSub           
       jsr ChkForPlayerAttrib        
       lda FireballThrowingTimer
       beq PlayerOffscreenChk        
       ldy #$00                      
       lda PlayerAnimTimer           
       cmp FireballThrowingTimer     
       sty FireballThrowingTimer     
       bcs PlayerOffscreenChk        
       sta FireballThrowingTimer     
       ldy #$07                      
       lda PlayerGfxTblOffsets,y     
       sta PlayerGfxOffset           
       ldy #$04                      
       lda Player_X_Speed
       ora Left_Right_Buttons        
       beq SUpdR                     
       dey                           
SUpdR: tya                           
       jsr RenderPlayerSub           

PlayerOffscreenChk:
           lda Player_OffscreenBits      
           lsr
           lsr                           
           lsr
           lsr
           sta $00                       
           ldx #$03                      
           lda Player_SprDataOffset      
           clc
           adc #$18                      
           tay                           
PROfsLoop: lda #$f8                      
           lsr $00                       
           bcc NPROffscr                 
           jsr DumpTwoSpr                
NPROffscr: tya
           sec                           
           sbc #$08                      
           tay
           dex                           
           bpl PROfsLoop                 
           rts                           



IntermediatePlayerData:


DrawPlayer_Intermediate:
          ldx #$05                       
PIntLoop: lda IntermediatePlayerData,x   
          sta $02,x                      
          dex
          bpl PIntLoop                   
          ldx #$b8                       
          ldy #$04                       
          jsr DrawPlayerLoop             
          lda Sprite_Attributes+36       
          ora #%01000000                 
          sta Sprite_Attributes+32       
          rts










RenderPlayerSub:
        sta $07                      
        lda Player_Rel_XPos
        sta Player_Pos_ForScroll     
        sta $05                      
        lda Player_Rel_YPos
        sta $02                      
        lda PlayerFacingDir
        sta $03                      
        lda Player_SprAttrib
        sta $04                      
        ldx PlayerGfxOffset          
        ldy Player_SprDataOffset     

DrawPlayerLoop:
        lda PlayerGraphicsTable,x    
        sta $00
        lda PlayerGraphicsTable+1,x  
        jsr DrawOneSpriteRow
        dec $07                      
        bne DrawPlayerLoop           
        rts

ProcessPlayerAction:
        lda Player_State      
        cmp #$03
        beq ActionClimbing    
        cmp #$02
        beq ActionFalling     
        cmp #$01
        bne ProcOnGroundActs  
        lda SwimmingFlag
        bne ActionSwimming    
        ldy #$06              
        lda CrouchingFlag     
        bne NonAnimatedActs   
        ldy #$00              
        jmp NonAnimatedActs   

ProcOnGroundActs:
        ldy #$06                   
        lda CrouchingFlag          
        bne NonAnimatedActs        
        ldy #$02                   
        lda Player_X_Speed         
        ora Left_Right_Buttons     
        beq NonAnimatedActs        
        lda Player_XSpeedAbsolute  
        cmp #$09
        bcc ActionWalkRun          
        lda Player_MovingDir       
        and PlayerFacingDir        
        bne ActionWalkRun          
        iny                        

NonAnimatedActs:
        jsr GetGfxOffsetAdder      
        lda #$00
        sta PlayerAnimCtrl         
        lda PlayerGfxTblOffsets,y  
        rts

ActionFalling:
        ldy #$04                  
        jsr GetGfxOffsetAdder     
        jmp GetCurrentAnimOffset  

ActionWalkRun:
        ldy #$04               
        jsr GetGfxOffsetAdder  
        jmp FourFrameExtent    

ActionClimbing:
        ldy #$05               
        lda Player_Y_Speed     
        beq NonAnimatedActs    
        jsr GetGfxOffsetAdder  
        jmp ThreeFrameExtent   

ActionSwimming:
        ldy #$01               
        jsr GetGfxOffsetAdder
        lda JumpSwimTimer      
        ora PlayerAnimCtrl     
        bne FourFrameExtent    
        lda A_B_Buttons
        asl                    
        bcs FourFrameExtent    

GetCurrentAnimOffset:
        lda PlayerAnimCtrl         
        jmp GetOffsetFromAnimCtrl  

FourFrameExtent:
        lda #$03              
        jmp AnimationControl  

ThreeFrameExtent:
        lda #$02              

AnimationControl:
          sta $00                   
          jsr GetCurrentAnimOffset  
          pha                       
          lda PlayerAnimTimer       
          bne ExAnimC               
          lda PlayerAnimTimerSet    
          sta PlayerAnimTimer       
          lda PlayerAnimCtrl
          clc                       
          adc #$01
          cmp $00                   
          bcc SetAnimC              
          lda #$00                  
SetAnimC: sta PlayerAnimCtrl        
ExAnimC:  pla                       
          rts

GetGfxOffsetAdder:
        lda PlayerSize  
        beq SzOfs       
        tya             
        clc             
        adc #$08        
        tay
SzOfs:  rts             

ChangeSizeOffsetAdder:



HandleChangeSize:
         ldy PlayerAnimCtrl           
         lda FrameCounter
         and #%00000011               
         bne GorSLog                  
         iny                          
         cpy #$0a                     
         bcc CSzNext                  
         ldy #$00                     
         sty PlayerChangeSizeFlag     
CSzNext: sty PlayerAnimCtrl           
GorSLog: lda PlayerSize               
         bne ShrinkPlayer             
         lda ChangeSizeOffsetAdder,y  
         ldy #$0f                     

GetOffsetFromAnimCtrl:
        asl                        
        asl                        
        asl                        
        adc PlayerGfxTblOffsets,y  
        rts                        

ShrinkPlayer:
        tya                          
        clc
        adc #$0a                     
        tax                          
        ldy #$09                     
        lda ChangeSizeOffsetAdder,x  
        bne ShrPlF                   
        ldy #$01                     
ShrPlF: lda PlayerGfxTblOffsets,y    
        rts                          

ChkForPlayerAttrib:
           ldy Player_SprDataOffset    
           lda GameEngineSubroutine
           cmp #$0b                    
           beq KilledAtt               
           lda PlayerGfxOffset         
           cmp #$50
           beq C_S_IGAtt               
           cmp #$b8                    
           beq C_S_IGAtt               
           cmp #$c0                    
           beq C_S_IGAtt
           cmp #$c8
           bne ExPlyrAt                
KilledAtt: lda Sprite_Attributes+16,y
           and #%00111111              
           sta Sprite_Attributes+16,y  
           lda Sprite_Attributes+20,y
           and #%00111111  
           ora #%01000000              
           sta Sprite_Attributes+20,y  
C_S_IGAtt: lda Sprite_Attributes+24,y
           and #%00111111              
           sta Sprite_Attributes+24,y  
           lda Sprite_Attributes+28,y
           and #%00111111
           ora #%01000000              
           sta Sprite_Attributes+28,y  
ExPlyrAt:  rts                         




RelativePlayerPosition:
        ldx #$00      
        ldy #$00      
        jmp RelWOfs   

RelativeBubblePosition:
        ldy #$01                
        jsr GetProperObjOffset  
        ldy #$03
        jmp RelWOfs             

RelativeFireballPosition:
         ldy #$00                    
         jsr GetProperObjOffset      
         ldy #$02
RelWOfs: jsr GetObjRelativePosition  
         ldx ObjectOffset            
         rts                         

RelativeMiscPosition:
        ldy #$02                
        jsr GetProperObjOffset  
        ldy #$06
        jmp RelWOfs             

RelativeEnemyPosition:
        lda #$01                     
        ldy #$01                     
        jmp VariableObjOfsRelPos

RelativeBlockPosition:
        lda #$09                     
        ldy #$04                     
        jsr VariableObjOfsRelPos
        inx                          
        inx
        lda #$09
        iny                          

VariableObjOfsRelPos:
        stx $00                     
        clc
        adc $00                     
        tax                         
        jsr GetObjRelativePosition
        ldx ObjectOffset            
        rts

GetObjRelativePosition:
        lda SprObject_Y_Position,x  
        sta SprObject_Rel_YPos,y    
        lda SprObject_X_Position,x  
        sec                         
        sbc ScreenLeft_X_Pos
        sta SprObject_Rel_XPos,y    
        rts




GetPlayerOffscreenBits:
        ldx #$00                 
        ldy #$00                 
        jmp GetOffScreenBitsSet

GetFireballOffscreenBits:
        ldy #$00                 
        jsr GetProperObjOffset   
        ldy #$02                 
        jmp GetOffScreenBitsSet  

GetBubbleOffscreenBits:
        ldy #$01                 
        jsr GetProperObjOffset   
        ldy #$03                 
        jmp GetOffScreenBitsSet  

GetMiscOffscreenBits:
        ldy #$02                 
        jsr GetProperObjOffset   
        ldy #$06                 
        jmp GetOffScreenBitsSet  

ObjOffsetData:


GetProperObjOffset:
        txa                  
        clc
        adc ObjOffsetData,y  
        tax                  
        rts

GetEnemyOffscreenBits:
        lda #$01                 
        ldy #$01                 
        jmp SetOffscrBitsOffset

GetBlockOffscreenBits:
        lda #$09       
        ldy #$04       

SetOffscrBitsOffset:
        stx $00
        clc           
        adc $00       
        tax

GetOffScreenBitsSet:
        tya                         
        pha
        jsr RunOffscrBitsSubs
        asl                         
        asl
        asl
        asl
        ora $00                     
        sta $00                     
        pla                         
        tay
        lda $00                     
        sta SprObject_OffscrBits,y
        ldx ObjectOffset
        rts

RunOffscrBitsSubs:
        jsr GetXOffscreenBits  
        lsr                    
        lsr
        lsr
        lsr
        sta $00                
        jmp GetYOffscreenBits








XOffscreenBitsData:



DefaultXOnscreenOfs:


GetXOffscreenBits:
          stx $04                     
          ldy #$01                    
XOfsLoop: lda ScreenEdge_X_Pos,y      
          sec                         
          sbc SprObject_X_Position,x  
          sta $07                     
          lda ScreenEdge_PageLoc,y    
          sbc SprObject_PageLoc,x     
          ldx DefaultXOnscreenOfs,y   
          cmp #$00      
          bmi XLdBData                
          ldx DefaultXOnscreenOfs+1,y 
          cmp #$01      
          bpl XLdBData                
          lda #$38                    
          sta $06
          lda #$08                    
          jsr DividePDiff
XLdBData: lda XOffscreenBitsData,x    
          ldx $04                     
          cmp #$00                    
          bne ExXOfsBS
          dey                         
          bpl XOfsLoop                
ExXOfsBS: rts



YOffscreenBitsData:




DefaultYOnscreenOfs:


HighPosUnitData:


GetYOffscreenBits:
          stx $04                      
          ldy #$01                     
YOfsLoop: lda HighPosUnitData,y        
          sec
          sbc SprObject_Y_Position,x   
          sta $07                      
          lda #$01                     
          sbc SprObject_Y_HighPos,x
          ldx DefaultYOnscreenOfs,y    
          cmp #$00
          bmi YLdBData                 
          ldx DefaultYOnscreenOfs+1,y  
          cmp #$01
          bpl YLdBData                 
          lda #$20                     
          sta $06
          lda #$04                     
          jsr DividePDiff
YLdBData: lda YOffscreenBitsData,x     
          ldx $04                      
          cmp #$00
          bne ExYOfsBS                 
          dey                          
          bpl YOfsLoop
ExYOfsBS: rts



DividePDiff:
          sta $05       
          lda $07       
          cmp $06       
          bcs ExDivPD   
          lsr           
          lsr
          lsr
          and #$07      
          cpy #$01      
          bcs SetOscrO  
          adc $05       
SetOscrO: tax           
ExDivPD:  rts           








DrawSpriteObject:
         lda $03                    
         lsr
         lsr                        
         lda $00
         bcc NoHFlip                
         sta Sprite_Tilenumber+4,y  
         lda $01                    
         sta Sprite_Tilenumber,y
         lda #$40                   
         bne SetHFAt                
NoHFlip: sta Sprite_Tilenumber,y    
         lda $01                    
         sta Sprite_Tilenumber+4,y
         lda #$00                   
SetHFAt: ora $04                    
         sta Sprite_Attributes,y    
         sta Sprite_Attributes+4,y
         lda $02                    
         sta Sprite_Y_Position,y    
         sta Sprite_Y_Position+4,y  
         lda $05       
         sta Sprite_X_Position,y    
         clc                        
         adc #$08                   
         sta Sprite_X_Position+4,y
         lda $02                    
         clc                        
         adc #$08
         sta $02
         tya                        
         clc                        
         adc #$08
         tay
         inx                        
         inx                        
         rts




SoundEngine:
         lda OperMode              
         bne SndOn
         sta SND_MASTERCTRL_REG    
         rts
SndOn:   lda #$ff
         sta JOYPAD_PORT2          
         lda #$0f
         sta SND_MASTERCTRL_REG    
         lda PauseModeFlag         
         bne InPause
         lda PauseSoundQueue       
         cmp #$01
         bne RunSoundSubroutines   
InPause: lda PauseSoundBuffer      
         bne ContPau
         lda PauseSoundQueue       
         beq SkipSoundSubroutines
         sta PauseSoundBuffer      
         sta PauseModeFlag         
         lda #$00                  
         sta SND_MASTERCTRL_REG
         sta Square1SoundBuffer
         sta Square2SoundBuffer
         sta NoiseSoundBuffer
         lda #$0f
         sta SND_MASTERCTRL_REG    
         lda #$2a                  
         sta Squ1_SfxLenCounter
PTone1F: lda #$44                  
         bne PTRegC                
ContPau: lda Squ1_SfxLenCounter    
         cmp #$24                  
         beq PTone2F
         cmp #$1e                  
         beq PTone1F
         cmp #$18                  
         bne DecPauC               
PTone2F: lda #$64                  
PTRegC:  ldx #$84
         ldy #$7f
         jsr PlaySqu1Sfx
DecPauC: dec Squ1_SfxLenCounter    
         bne SkipSoundSubroutines
         lda #$00                  
         sta SND_MASTERCTRL_REG    
         lda PauseSoundBuffer      
         cmp #$02                  
         bne SkipPIn
         lda #$00                  
         sta PauseModeFlag
SkipPIn: lda #$00                  
         sta PauseSoundBuffer
         beq SkipSoundSubroutines

RunSoundSubroutines:
         jsr Square1SfxHandler  
         jsr Square2SfxHandler  
         jsr NoiseSfxHandler    
         jsr MusicHandler       
         lda #$00               
         sta AreaMusicQueue
         sta EventMusicQueue

SkipSoundSubroutines:
          lda #$00               
          sta Square1SoundQueue
          sta Square2SoundQueue
          sta NoiseSoundQueue
          sta PauseSoundQueue
          ldy DAC_Counter        
          lda AreaMusicBuffer
          and #%00000011         
          beq NoIncDAC
          inc DAC_Counter        
          cpy #$30
          bcc StrWave            
NoIncDAC: tya
          beq StrWave            
          dec DAC_Counter        
StrWave:  sty SND_DELTA_REG+1    
          rts                    



Dump_Squ1_Regs:
      sty SND_SQUARE1_REG+1  
      stx SND_SQUARE1_REG
      rts
      
PlaySqu1Sfx:
      jsr Dump_Squ1_Regs     

SetFreq_Squ1:
      ldx #$00               

Dump_Freq_Regs:
        tay
        lda FreqRegLookupTbl+1,y  
        beq NoTone                
        sta SND_REGISTER+2,x      
        lda FreqRegLookupTbl,y    
        ora #%00001000            
        sta SND_REGISTER+3,x
NoTone: rts

Dump_Sq2_Regs:
      stx SND_SQUARE2_REG    
      sty SND_SQUARE2_REG+1
      rts

PlaySqu2Sfx:
      jsr Dump_Sq2_Regs      

SetFreq_Squ2:
      ldx #$04               
      bne Dump_Freq_Regs     

SetFreq_Tri:
      ldx #$08               
      bne Dump_Freq_Regs     



SwimStompEnvelopeData:



PlayFlagpoleSlide:
       lda #$40               
       sta Squ1_SfxLenCounter
       lda #$62               
       jsr SetFreq_Squ1
       ldx #$99               
       bne FPS2nd

PlaySmallJump:
       lda #$26               
       bne JumpRegContents

PlayBigJump:
       lda #$18               

JumpRegContents:
       ldx #$82               
       ldy #$a7               
       jsr PlaySqu1Sfx
       lda #$28               
       sta Squ1_SfxLenCounter 

ContinueSndJump:
          lda Squ1_SfxLenCounter 
          cmp #$25               
          bne N2Prt
          ldx #$5f               
          ldy #$f6
          bne DmpJpFPS           
N2Prt:    cmp #$20               
          bne DecJpFPS
          ldx #$48               
FPS2nd:   ldy #$bc               
DmpJpFPS: jsr Dump_Squ1_Regs
          bne DecJpFPS           

PlayFireballThrow:
        lda #$05
        ldy #$99                 
        bne Fthrow               

PlayBump:
          lda #$0a                
          ldy #$93
Fthrow:   ldx #$9e                
          sta Squ1_SfxLenCounter
          lda #$0c                
          jsr PlaySqu1Sfx

ContinueBumpThrow:    
          lda Squ1_SfxLenCounter  
          cmp #$06   
          bne DecJpFPS
          lda #$bb                
          sta SND_SQUARE1_REG+1
DecJpFPS: bne BranchToDecLength1  


Square1SfxHandler:
       ldy Square1SoundQueue   
       beq CheckSfx1Buffer
       sty Square1SoundBuffer  
       bmi PlaySmallJump       
       lsr Square1SoundQueue
       bcs PlayBigJump         
       lsr Square1SoundQueue
       bcs PlayBump            
       lsr Square1SoundQueue
       bcs PlaySwimStomp       
       lsr Square1SoundQueue
       bcs PlaySmackEnemy      
       lsr Square1SoundQueue
       bcs PlayPipeDownInj     
       lsr Square1SoundQueue
       bcs PlayFireballThrow   
       lsr Square1SoundQueue
       bcs PlayFlagpoleSlide   

CheckSfx1Buffer:
       lda Square1SoundBuffer   
       beq ExS1H                
       bmi ContinueSndJump      
       lsr
       bcs ContinueSndJump      
       lsr
       bcs ContinueBumpThrow    
       lsr
       bcs ContinueSwimStomp    
       lsr
       bcs ContinueSmackEnemy   
       lsr
       bcs ContinuePipeDownInj  
       lsr
       bcs ContinueBumpThrow    
       lsr
       bcs DecrementSfx1Length  
ExS1H: rts

PlaySwimStomp:
      lda #$0e               
      sta Squ1_SfxLenCounter
      ldy #$9c               
      ldx #$9e
      lda #$26
      jsr PlaySqu1Sfx

ContinueSwimStomp: 
      ldy Squ1_SfxLenCounter        
      lda SwimStompEnvelopeData-1,y 
      sta SND_SQUARE1_REG           
      cpy #$06   
      bne BranchToDecLength1
      lda #$9e                      
      sta SND_SQUARE1_REG+2         

BranchToDecLength1: 
      bne DecrementSfx1Length  

PlaySmackEnemy:
      lda #$0e                 
      ldy #$cb
      ldx #$9f
      sta Squ1_SfxLenCounter
      lda #$28                 
      jsr PlaySqu1Sfx
      bne DecrementSfx1Length  

ContinueSmackEnemy:
        ldy Squ1_SfxLenCounter  
        cpy #$08
        bne SmSpc
        lda #$a0                
        sta SND_SQUARE1_REG+2   
        lda #$9f
        bne SmTick
SmSpc:  lda #$90                
SmTick: sta SND_SQUARE1_REG

DecrementSfx1Length:
      dec Squ1_SfxLenCounter    
      bne ExSfx1

StopSquare1Sfx:
        ldx #$00                
        stx $f1                 
        ldx #$0e
        stx SND_MASTERCTRL_REG
        ldx #$0f
        stx SND_MASTERCTRL_REG
ExSfx1: rts

PlayPipeDownInj:  
      lda #$2f                
      sta Squ1_SfxLenCounter

ContinuePipeDownInj:
         lda Squ1_SfxLenCounter  
         lsr                     
         bcs NoPDwnL             
         lsr
         bcs NoPDwnL
         and #%00000010
         beq NoPDwnL
         ldy #$91                
         ldx #$9a
         lda #$44
         jsr PlaySqu1Sfx
NoPDwnL: jmp DecrementSfx1Length



ExtraLifeFreqData:


PowerUpGrabFreqData:





PUp_VGrow_FreqData:





PlayCoinGrab:
        lda #$35             
        ldx #$8d             
        bne CGrab_TTickRegL

PlayTimerTick:
        lda #$06             
        ldx #$98             

CGrab_TTickRegL:
        sta Squ2_SfxLenCounter 
        ldy #$7f                
        lda #$42                
        jsr PlaySqu2Sfx

ContinueCGrabTTick:
        lda Squ2_SfxLenCounter  
        cmp #$30                
        bne N2Tone
        lda #$54                
        sta SND_SQUARE2_REG+2
N2Tone: bne DecrementSfx2Length

PlayBlast:
        lda #$20                
        sta Squ2_SfxLenCounter
        ldy #$94                
        lda #$5e
        bne SBlasJ

ContinueBlast:
        lda Squ2_SfxLenCounter  
        cmp #$18
        bne DecrementSfx2Length
        ldy #$93                
        lda #$18
SBlasJ: bne BlstSJp             

PlayPowerUpGrab:
        lda #$36                    
        sta Squ2_SfxLenCounter

ContinuePowerUpGrab:   
        lda Squ2_SfxLenCounter      
        lsr                         
        bcs DecrementSfx2Length     
        tay
        lda PowerUpGrabFreqData-1,y 
        ldx #$5d                    
        ldy #$7f

LoadSqu2Regs:
        jsr PlaySqu2Sfx

DecrementSfx2Length:
        dec Squ2_SfxLenCounter   
        bne ExSfx2

EmptySfx2Buffer:
        ldx #$00                
        stx Square2SoundBuffer

StopSquare2Sfx:
        ldx #$0d                
        stx SND_MASTERCTRL_REG 
        ldx #$0f
        stx SND_MASTERCTRL_REG
ExSfx2: rts

Square2SfxHandler:
        lda Square2SoundBuffer 
        and #Sfx_ExtraLife     
        bne ContinueExtraLife
        ldy Square2SoundQueue  
        beq CheckSfx2Buffer
        sty Square2SoundBuffer 
        bmi PlayBowserFall     
        lsr Square2SoundQueue
        bcs PlayCoinGrab       
        lsr Square2SoundQueue
        bcs PlayGrowPowerUp    
        lsr Square2SoundQueue
        bcs PlayGrowVine       
        lsr Square2SoundQueue
        bcs PlayBlast          
        lsr Square2SoundQueue
        bcs PlayTimerTick      
        lsr Square2SoundQueue
        bcs PlayPowerUpGrab    
        lsr Square2SoundQueue
        bcs PlayExtraLife      

CheckSfx2Buffer:
        lda Square2SoundBuffer   
        beq ExS2H                
        bmi ContinueBowserFall   
        lsr
        bcs Cont_CGrab_TTick     
        lsr
        bcs ContinueGrowItems    
        lsr
        bcs ContinueGrowItems    
        lsr
        bcs ContinueBlast        
        lsr
        bcs Cont_CGrab_TTick     
        lsr
        bcs ContinuePowerUpGrab  
        lsr
        bcs ContinueExtraLife    
ExS2H:  rts

Cont_CGrab_TTick:
        jmp ContinueCGrabTTick

JumpToDecLength2:
        jmp DecrementSfx2Length

PlayBowserFall:    
         lda #$38                
         sta Squ2_SfxLenCounter
         ldy #$c4                
         lda #$18
BlstSJp: bne PBFRegs

ContinueBowserFall:
          lda Squ2_SfxLenCounter   
          cmp #$08
          bne DecrementSfx2Length
          ldy #$a4                 
          lda #$5a
PBFRegs:  ldx #$9f                 
EL_LRegs: bne LoadSqu2Regs         

PlayExtraLife:
        lda #$30                  
        sta Squ2_SfxLenCounter

ContinueExtraLife:
          lda Squ2_SfxLenCounter   
          ldx #$03                  
DivLLoop: lsr
          bcs JumpToDecLength2      
          dex
          bne DivLLoop              
          tay
          lda ExtraLifeFreqData-1,y 
          ldx #$82
          ldy #$7f
          bne EL_LRegs              

PlayGrowPowerUp:
        lda #$10                
        bne GrowItemRegs

PlayGrowVine:
        lda #$20                

GrowItemRegs:
        sta Squ2_SfxLenCounter   
        lda #$7f                  
        sta SND_SQUARE2_REG+1
        lda #$00                  
        sta Sfx_SecondaryCounter

ContinueGrowItems:
        inc Sfx_SecondaryCounter  
        lda Sfx_SecondaryCounter  
        lsr                       
        tay
        cpy Squ2_SfxLenCounter    
        beq StopGrowItems         
        lda #$9d                  
        sta SND_SQUARE2_REG
        lda PUp_VGrow_FreqData,y  
        jsr SetFreq_Squ2
        rts

StopGrowItems:
        jmp EmptySfx2Buffer       



BrickShatterFreqData:



PlayBrickShatter:
        lda #$20                 
        sta Noise_SfxLenCounter

ContinueBrickShatter:
        lda Noise_SfxLenCounter  
        lsr                         
        bcc DecrementSfx3Length
        tay
        ldx BrickShatterFreqData,y  
        lda BrickShatterEnvData,y

PlayNoiseSfx:
        sta SND_NOISE_REG        
        stx SND_NOISE_REG+2
        lda #$18
        sta SND_NOISE_REG+3

DecrementSfx3Length:
        dec Noise_SfxLenCounter  
        bne ExSfx3
        lda #$f0                 
        sta SND_NOISE_REG
        lda #$00
        sta NoiseSoundBuffer
ExSfx3: rts

NoiseSfxHandler:
        ldy NoiseSoundQueue   
        beq CheckNoiseBuffer
        sty NoiseSoundBuffer  
        lsr NoiseSoundQueue
        bcs PlayBrickShatter  
        lsr NoiseSoundQueue
        bcs PlayBowserFlame   

CheckNoiseBuffer:
        lda NoiseSoundBuffer      
        beq ExNH                  
        lsr
        bcs ContinueBrickShatter  
        lsr
        bcs ContinueBowserFlame   
ExNH:   rts

PlayBowserFlame:
        lda #$40                    
        sta Noise_SfxLenCounter

ContinueBowserFlame:
        lda Noise_SfxLenCounter
        lsr
        tay
        ldx #$0f                    
        lda BowserFlameEnvData-1,y
        bne PlayNoiseSfx            



ContinueMusic:
        jmp HandleSquare2Music  

MusicHandler:
        lda EventMusicQueue     
        bne LoadEventMusic
        lda AreaMusicQueue      
        bne LoadAreaMusic
        lda EventMusicBuffer    
        ora AreaMusicBuffer
        bne ContinueMusic 
        rts                     

LoadEventMusic:
           sta EventMusicBuffer      
           cmp #DeathMusic           
           bne NoStopSfx             
           jsr StopSquare1Sfx        
           jsr StopSquare2Sfx        
NoStopSfx: ldx AreaMusicBuffer
           stx AreaMusicBuffer_Alt   
           ldy #$00
           sty NoteLengthTblAdder    
           sty AreaMusicBuffer       
           cmp #TimeRunningOutMusic  
           bne FindEventMusicHeader
           ldx #$08                  
           stx NoteLengthTblAdder
           bne FindEventMusicHeader  

LoadAreaMusic:
         cmp #$04                  
         bne NoStop1               
         jsr StopSquare1Sfx
NoStop1: ldy #$10                  
GMLoopB: sty GroundMusicHeaderOfs

HandleAreaMusicLoopB:
         ldy #$00                  
         sty EventMusicBuffer
         sta AreaMusicBuffer       
         cmp #$01                  
         bne FindAreaMusicHeader
         inc GroundMusicHeaderOfs  
         ldy GroundMusicHeaderOfs  
         cpy #$32
         bne LoadHeader            
         ldy #$11
         bne GMLoopB               

FindAreaMusicHeader:
        ldy #$08                   
        sty MusicOffset_Square2    

FindEventMusicHeader:
        iny                       
        lsr                       
        bcc FindEventMusicHeader

LoadHeader:
        lda MusicHeaderOffsetData,y  
        tay
        lda MusicHeaderData,y        
        sta NoteLenLookupTblOfs
        lda MusicHeaderData+1,y
        sta MusicDataLow
        lda MusicHeaderData+2,y
        sta MusicDataHigh
        lda MusicHeaderData+3,y
        sta MusicOffset_Triangle
        lda MusicHeaderData+4,y
        sta MusicOffset_Square1
        lda MusicHeaderData+5,y
        sta MusicOffset_Noise
        sta NoiseDataLoopbackOfs
        lda #$01                     
        sta Squ2_NoteLenCounter
        sta Squ1_NoteLenCounter
        sta Tri_NoteLenCounter
        sta Noise_BeatLenCounter
        lda #$00                     
        sta MusicOffset_Square2
        sta AltRegContentFlag        
        lda #$0b                     
        sta SND_MASTERCTRL_REG
        lda #$0f
        sta SND_MASTERCTRL_REG

HandleSquare2Music:
        dec Squ2_NoteLenCounter  
        bne MiscSqu2MusicTasks   
        ldy MusicOffset_Square2  
        inc MusicOffset_Square2
        lda (MusicData),y
        beq EndOfMusicData       
        bpl Squ2NoteHandler      
        bne Squ2LengthHandler    

EndOfMusicData:
        lda EventMusicBuffer     
        cmp #TimeRunningOutMusic
        bne NotTRO
        lda AreaMusicBuffer_Alt  
        bne MusicLoopBack        
NotTRO: and #VictoryMusic        
        bne VictoryMLoopBack
        lda AreaMusicBuffer      
        and #%01011111
        bne MusicLoopBack        
        lda #$00                 
        sta AreaMusicBuffer      
        sta EventMusicBuffer
        sta SND_TRIANGLE_REG
        lda #$90    
        sta SND_SQUARE1_REG
        sta SND_SQUARE2_REG
        rts

MusicLoopBack:
        jmp HandleAreaMusicLoopB

VictoryMLoopBack:
        jmp LoadEventMusic

Squ2LengthHandler:
        jsr ProcessLengthData    
        sta Squ2_NoteLenBuffer
        ldy MusicOffset_Square2  
        inc MusicOffset_Square2
        lda (MusicData),y

Squ2NoteHandler:
          ldx Square2SoundBuffer     
          bne SkipFqL1
          jsr SetFreq_Squ2           
          beq Rest                   
          jsr LoadControlRegs        
Rest:     sta Squ2_EnvelopeDataCtrl  
          jsr Dump_Sq2_Regs          
SkipFqL1: lda Squ2_NoteLenBuffer     
          sta Squ2_NoteLenCounter

MiscSqu2MusicTasks:
           lda Square2SoundBuffer     
           bne HandleSquare1Music
           lda EventMusicBuffer       
           and #%10010001             
           bne HandleSquare1Music
           ldy Squ2_EnvelopeDataCtrl  
           beq NoDecEnv1
           dec Squ2_EnvelopeDataCtrl  
NoDecEnv1: jsr LoadEnvelopeData       
           sta SND_SQUARE2_REG        
           ldx #$7f                   
           stx SND_SQUARE2_REG+1

HandleSquare1Music:
        ldy MusicOffset_Square1    
        beq HandleTriangleMusic    
        dec Squ1_NoteLenCounter    
        bne MiscSqu1MusicTasks     

FetchSqu1MusicData:
        ldy MusicOffset_Square1    
        inc MusicOffset_Square1
        lda (MusicData),y
        bne Squ1NoteHandler        
        lda #$83
        sta SND_SQUARE1_REG        
        lda #$94                   
        sta SND_SQUARE1_REG+1      
        sta AltRegContentFlag
        bne FetchSqu1MusicData     

Squ1NoteHandler:
           jsr AlternateLengthHandler
           sta Squ1_NoteLenCounter    
           ldy Square1SoundBuffer     
           bne HandleTriangleMusic
           txa
           and #%00111110             
           jsr SetFreq_Squ1           
           beq SkipCtrlL
           jsr LoadControlRegs
SkipCtrlL: sta Squ1_EnvelopeDataCtrl  
           jsr Dump_Squ1_Regs

MiscSqu1MusicTasks:
              lda Square1SoundBuffer     
              bne HandleTriangleMusic
              lda EventMusicBuffer       
              and #%10010001
              bne DeathMAltReg
              ldy Squ1_EnvelopeDataCtrl  
              beq NoDecEnv2
              dec Squ1_EnvelopeDataCtrl  
NoDecEnv2:    jsr LoadEnvelopeData       
              sta SND_SQUARE1_REG        
DeathMAltReg: lda AltRegContentFlag      
              bne DoAltLoad
              lda #$7f                   
DoAltLoad:    sta SND_SQUARE1_REG+1      

HandleTriangleMusic:
        lda MusicOffset_Triangle
        dec Tri_NoteLenCounter    
        bne HandleNoiseMusic      
        ldy MusicOffset_Triangle  
        inc MusicOffset_Triangle
        lda (MusicData),y
        beq LoadTriCtrlReg        
        bpl TriNoteHandler        
        jsr ProcessLengthData     
        sta Tri_NoteLenBuffer     
        lda #$1f
        sta SND_TRIANGLE_REG      
        ldy MusicOffset_Triangle  
        inc MusicOffset_Triangle
        lda (MusicData),y
        beq LoadTriCtrlReg        

TriNoteHandler:
          jsr SetFreq_Tri
          ldx Tri_NoteLenBuffer   
          stx Tri_NoteLenCounter
          lda EventMusicBuffer
          and #%01101110          
          bne NotDOrD4            
          lda AreaMusicBuffer     
          and #%00001010
          beq HandleNoiseMusic    
NotDOrD4: txa                     
          cmp #$12                
          bcs LongN
          lda EventMusicBuffer    
          and #EndOfCastleMusic
          beq MediN
          lda #$0f                
          bne LoadTriCtrlReg      
MediN:    lda #$1f                
          bne LoadTriCtrlReg      
LongN:    lda #$ff                

LoadTriCtrlReg:           
        sta SND_TRIANGLE_REG      

HandleNoiseMusic:
        lda AreaMusicBuffer       
        and #%11110011
        beq ExitMusicHandler      
        dec Noise_BeatLenCounter  
        bne ExitMusicHandler      

FetchNoiseBeatData:
        ldy MusicOffset_Noise       
        inc MusicOffset_Noise
        lda (MusicData),y           
        bne NoiseBeatHandler
        lda NoiseDataLoopbackOfs    
        sta MusicOffset_Noise       
        bne FetchNoiseBeatData      

NoiseBeatHandler:
        jsr AlternateLengthHandler
        sta Noise_BeatLenCounter    
        txa
        and #%00111110              
        beq SilentBeat              
        cmp #$30                    
        beq LongBeat                
        cmp #$20
        beq StrongBeat
        and #%00010000  
        beq SilentBeat
        lda #$1c        
        ldx #$03
        ldy #$18
        bne PlayBeat

StrongBeat:
        lda #$1c        
        ldx #$0c
        ldy #$18
        bne PlayBeat

LongBeat:
        lda #$1c        
        ldx #$03
        ldy #$58
        bne PlayBeat

SilentBeat:
        lda #$10        

PlayBeat:
        sta SND_NOISE_REG    
        stx SND_NOISE_REG+2
        sty SND_NOISE_REG+3

ExitMusicHandler:
        rts

AlternateLengthHandler:
        tax            
        ror            
        txa            
        rol            
        rol            
        rol

ProcessLengthData:
        and #%00000111              
        clc
        adc $f0                     
        adc NoteLengthTblAdder      
        tay
        lda MusicLengthLookupTbl,y  
        rts

LoadControlRegs:
           lda EventMusicBuffer  
           and #EndOfCastleMusic
           beq NotECstlM
           lda #$04              
           bne AllMus            
NotECstlM: lda AreaMusicBuffer
           and #%01111101        
           beq WaterMus
           lda #$08              
           bne AllMus
WaterMus:  lda #$28              
AllMus:    ldx #$82              
           ldy #$7f
           rts

LoadEnvelopeData:
        lda EventMusicBuffer           
        and #EndOfCastleMusic
        beq LoadUsualEnvData
        lda EndOfCastleMusicEnvData,y  
        rts

LoadUsualEnvData:
        lda AreaMusicBuffer            
        and #%01111101
        beq LoadWaterEventMusEnvData
        lda AreaMusicEnvData,y         
        rts

LoadWaterEventMusEnvData:
        lda WaterEventMusEnvData,y     
        rts





MusicHeaderData:






























 





























GameOverMusData:






TimeRunOutMusData:







WinLevelMusData:














UndergroundMusData:










WaterMusData:



























EndOfCastleMusData:















VictoryMusData:








FreqRegLookupTbl:














MusicLengthLookupTbl:







EndOfCastleMusicEnvData:


AreaMusicEnvData:


WaterEventMusEnvData:






BowserFlameEnvData:





BrickShatterEnvData:


