// Created By Dawit Kiros Woldemichael
//Date Created 10/10/2014

using System;
using System.Collections;

namespace NBI.Presentation.Tsa.Classes
{
    /// <summary>
    /// The class enables one to convert numbers in to text format
    /// The class is specially designed to be used for conditions where the conversion of monetary numbers 
    /// to their respective text formats ( Birr and CENTS)
    /// </summary>
    public class NTWCon
    {
        private string[] positionArray = { "", "Thousand", "Million", "Billion", "Trillion", "Quadrillion" };

        #region	constructor
        public NTWCon()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        #endregion

        public static string Convert(object MyNumber)
        {
            return new NTWCon().ConvertToWords(MyNumber);
        }

        public string ConvertToWords(object MyNumber)
        {
            string AsText = MyNumber.ToString().Trim();
            int decimalIndex = AsText.IndexOf(".");

            string PreDecimal = "";

            // HANDLE THE CASE OF INCORRECT INPUT eg. "."
            if (decimalIndex >= 0)
                PreDecimal = AsText.Substring(0, decimalIndex);
            else
                PreDecimal = AsText;


            string Converted = "";

            #region Convert predecimal digits
            // as long as there are more triads add them to the triads list

            int index = PreDecimal.Length - 3; // start from the first available triad ( if it exits )
            string nextTriad = "";
            string nextConvertedTriad = "";
            int nextTriadNumber = 0;

            do
            {
                if (index > 0)
                {
                    //find the substring upto that index ie the triad 
                    nextTriad = PreDecimal.Substring(index, 3);

                    //convert it into words 
                    nextConvertedTriad = ConvertTriad(nextTriad);

                    // and append it to the final converted string
                    Converted = nextConvertedTriad + (nextConvertedTriad == "" ? "" : (" " + positionArray[nextTriadNumber] + " ")) + Converted;

                    //decrement the index by three to find the next triad
                    index -= 3;

                    // increment the triad number
                    nextTriadNumber++;
                }
                else // index is past the length of string representation of number
                {
                    // come back to the last valid position
                    int lastIndex = index + 3;

                    //convert whatever is left 
                    // fortunately lastIndex coincides with the number of digits left (1 or 2)
                    nextTriad = PreDecimal.Substring(0, lastIndex);

                    //convert it into words 
                    nextConvertedTriad = ConvertTriad(nextTriad);

                    // and append it to the final converted string

                    //consider also the cases where only cents are to get converted ( no need of adding the Birr value)

                    //for case where there exists Birr and CENTS( eg 123.43)
                    if (nextConvertedTriad != "" & decimalIndex >= 0)

                        Converted = nextConvertedTriad + (nextConvertedTriad == "" ? "" : (" " + positionArray[nextTriadNumber] + " ")) + Converted + "Birr" + " and ";
                    //for case where there exists Birr ONLY( eg 123)
                    if (nextConvertedTriad != "" & decimalIndex < 0)
                        Converted = nextConvertedTriad + (nextConvertedTriad == "" ? "" : (" " + positionArray[nextTriadNumber] + " ")) + Converted + "Birr";
                    //for case where there exists CENTS ONLY( eg 0.23)
                    if (nextConvertedTriad == "")

                        Converted = nextConvertedTriad + (nextConvertedTriad == "" ? "" : (" " + positionArray[nextTriadNumber] + " ")) + Converted;

                    // exit out of the loop
                    break;
                }
            }
            while (true);
            #endregion

            #region Convert postdecimal
            int lengthAfterDecimalPlace = AsText.Length - 1 - decimalIndex;

            if (lengthAfterDecimalPlace < 2)
                AsText += "0";

            string PostDecimal = "";
            if (decimalIndex >= 0)
            {
                PostDecimal = AsText.Substring(decimalIndex + 1, 2);

                Converted += PostDecimal + "/100";
            }

            return Converted;

            #endregion
            
        }


        /// <summary>
        /// Converts an integer (no decimal points) less than 1000 
        /// (called a 'triad' hereafer) into text. 
        /// </summary>
        /// <param name="triad">This parameter is a string that must 
        /// be less than or equal to 3 in length</param>
        /// <returns>The text representation of the triad</returns>
        private string ConvertTriad(string triad)
        {
            string ones = "";	// character at the ones place in the triad
            string tens = "";
            string hundreds = "";

            // Determine the ones, tens and hundreds place digits in the
            // triad by considering the cases of different number of digits
            if (triad.Length == 3)
            {
                ones = triad.Substring(2, 1);
                tens = triad.Substring(1, 1);
                hundreds = triad.Substring(0, 1);
            }
            else if (triad.Length == 2)
            {
                ones = triad.Substring(1, 1);
                tens = triad.Substring(0, 1);
            }
            else if (triad.Length == 1)
            {
                ones = triad.Substring(0, 1);
            }

            // string where the text representation of the triad will be stored
            string Converted = "";

            // Attach the text representation of the ones place to 'Converted'
            // Proceed only if there is a ones place
            if (ones != "")
            {
                Converted += ConvertSingleDigit(ones);
            }

            // Attach the text representation of the tens place to 'Converted'
            // Proceed only if there is a tens place
            if (tens != "")
            {
                // determine the special case of '1' at tens place
                if (tens == "1")
                    // Overwrite converted for this special case
                    Converted = Convert1AsTensPlace(ones);
                else
                    Converted = ConvertTensPlace(tens) + Converted;
            }


            // Attach the text representation of the hundreds place to 'Converted'
            // Proceed only if there is a hundreds place
            if (hundreds != "")
            {
                string hundPlace = ConvertSingleDigit(hundreds);
                Converted = hundPlace + (hundPlace != "" ? " Hundred " : "") + Converted;
            }

            return Converted;
        }


        /// <summary>
        /// Converts one digit to text. Zero is converted to an empty text
        /// </summary>
        /// <param name="Digit">The digit to be converted into text. The length of this parameter must be one</param>
        /// <returns>A text representation of the digit</returns>
        private string ConvertSingleDigit(string Digit)
        {
            string ConvertedDigit = "";

            switch (int.Parse(Digit))
            {
                case 1:
                    ConvertedDigit = "One";
                    break;
                case 2:
                    ConvertedDigit = "Two";
                    break;
                case 3:
                    ConvertedDigit = "Three";
                    break;
                case 4:
                    ConvertedDigit = "Four";
                    break;
                case 5:
                    ConvertedDigit = "Five";
                    break;
                case 6:
                    ConvertedDigit = "Six";
                    break;
                case 7:
                    ConvertedDigit = "Seven";
                    break;
                case 8:
                    ConvertedDigit = "Eight";
                    break;
                case 9:
                    ConvertedDigit = "Nine";
                    break;
                case 0:
                    ConvertedDigit = "";
                    break;
            }

            return ConvertedDigit;
        }


        /// <summary>
        /// Finds the text representation of a digit at the tens place in a 
        /// number. Does not consider the special case of 1 as tens place.length of "TensText" must be one
        /// </summary>
        /// <param name="TensText"></param>
        /// <returns></returns>
        private string ConvertTensPlace(string TensText)
        {
            string Converted = "";

            switch (int.Parse(TensText))
            {
                case 2:
                    Converted = "Twenty ";
                    break;
                case 3:
                    Converted = "Thirty ";
                    break;
                case 4:
                    Converted = "Forty ";
                    break;
                case 5:
                    Converted = "Fifty ";
                    break;
                case 6:
                    Converted = "Sixty ";
                    break;
                case 7:
                    Converted = "Seventy ";
                    break;
                case 8:
                    Converted = "Eighty ";
                    break;
                case 9:
                    Converted = "Ninty ";
                    break;
                default:
                    break;
            }
            return Converted;
        }


        /// <summary>
        /// Converts '1' into text when it appears at the tens place in a number.
        /// The next digit is passed as a parameter.
        /// </summary>
        /// <param name="OnesText">
        /// The ones place number next to the tens place ("1" in this case)</param>
        /// <returns></returns>
        private string Convert1AsTensPlace(string OnesText)
        {
            string Converted;

            Converted = ""; // Null out the temporary function value.

            switch (int.Parse(OnesText))
            {
                case 0:
                    Converted = "Ten";
                    break;
                case 1:
                    Converted = "Eleven";
                    break;
                case 2:
                    Converted = "Twelve";
                    break;
                case 3:
                    Converted = "Thirteen"; 
                    break;
                case 4:
                    Converted = "Fourteen"; 
                    break;
                case 5:
                    Converted = "Fifteen"; 
                    break;
                case 6:
                    Converted = "Sixteen"; 
                    break;
                case 7:
                    Converted = "Seventeen"; 
                    break;
                case 8:
                    Converted = "Eighteen"; 
                    break;
                case 9:
                    Converted = "Nineteen";
                    break;
            }

            return Converted;
        }//end of Convert1AsTensPlace()
    }
}

