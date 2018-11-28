import React from 'react';

import ChordDiagram from './ChordDiagram';

/*



Gdim7 g a# c#  e
      I


  g b d f a c e


    C d E f G a B c D  F  A


1 2 3 4 5 6 7 8 9 10 11 12 13
c d e f g a b c d  e  f  g  a


0  1  2  3 4 5 6 7 8 9 10 11
a     b  c   d   e f    g 
*/

class Diagram extends React.Component {

    constructor(props) {
        super(props);

        /*
            0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18  19 20 21
            g     a     b  c     d     e  f     g     a     b  c      d     e
            I     2     3  4     V     6  7     8     9    10 11     12    13
          */

        this.chordType = {

            M: [0, 4, 7],
            m: [0, 3, 7],
            "7": [0, 4, 7, 10],
            "m7": [0, 3, 7, 10],
            "maj7": [0, 4, 7, 11],
        };

        this.state = {
            base: this.props.base,
            chordType: this.props.chordType
        };

        this.handleBaseChange = this.handleBaseChange.bind(this);
        this.handleChordTypeChange = this.handleChordTypeChange.bind(this);
    }

    handleBaseChange(event) {
        this.setState({
            base: event.target.value
        });
    }
    handleChordTypeChange(event) {
        this.setState({
            chordType: event.target.value
        });
    }

    getNotes() {

        let baseNote = parseInt(this.state.base);
        return this.chordType[this.state.chordType].map(function (note) {

            return (note + baseNote) % 12;

        })

    }

    render() {

        const {
            strings,
            frets
        } = this.props;

        return <div >

            <
            select value = {
                this.state.base
            }
        onChange = {
                this.handleBaseChange
            } >
            <
            option value = "0" > A < /option> <
        option value = "1" > A# < /option> <
        option value = "2" > B < /option> <
        option value = "3" > C < /option> <
        option value = "4" > C# < /option> <
        option value = "5" > D < /option> <
        option value = "6" > D# < /option> <
        option value = "7" > E < /option> <
        option value = "8" > F < /option> <
        option value = "9" > F# < /option> <
        option value = "10" > G < /option> <
        option value = "11" > G# < /option> < /
            select >

            <
            select value = {
                this.state.chordType
            }
        onChange = {
                this.handleChordTypeChange
            } >

            {

                Object.keys(this.chordType)
                .map(function (key) {
                    return <option value = {
                        key
                    }
                    key = {
                        key
                    } > {
                        key
                    } < /option>

                })
            }

        <
        /select>

        <
        ChordDiagram frets = {
            frets
        }
        strings = {
            strings
        }
        keys = {
            this.getNotes()
        }
        />

        <
        /div>
    }

}

export default Diagram;
