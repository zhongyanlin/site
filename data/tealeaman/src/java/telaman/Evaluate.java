/*
 * Decompiled with CFR 0_87.
 */
package telaman;

import telaman.Toolbox;
import telaman.WrongFormula;

public class Evaluate {
    public static double arithematic(String exp) throws WrongFormula {
        int i;
        int j = exp.indexOf("(");
        if (j == -1) {
            return Evaluate.eval(exp.replaceAll(" ", ""));
        }
        int k = 1;
        for (i = j + 1; i < exp.length(); ++i) {
            if (exp.charAt(i) == ')') {
                if (--k != 0) continue;
                break;
            }
            if (exp.charAt(i) != '(') continue;
            ++k;
        }
        if (k > 0) {
            throw new WrongFormula(exp);
        }
        double b = Evaluate.arithematic(exp.substring(j + 1, i));
        exp = exp.substring(0, j) + b + exp.substring(i + 1);
        return Evaluate.arithematic(exp);
    }

    public static double eval(final String str) {
    return new Object() {
        int pos = -1, ch;

        void nextChar() {
            ch = (++pos < str.length()) ? str.charAt(pos) : -1;
        }

        boolean eat(int charToEat) {
            while (ch == ' ') nextChar();
            if (ch == charToEat) {
                nextChar();
                return true;
            }
            return false;
        }

        double parse() {
            nextChar();
            double x = parseExpression();
            if (pos < str.length()) throw new RuntimeException("Unexpected: " + (char)ch);
            return x;
        }

        // Grammar:
        // expression = term | expression `+` term | expression `-` term
        // term = factor | term `*` factor | term `/` factor
        // factor = `+` factor | `-` factor | `(` expression `)`
        //        | number | functionName factor | factor `^` factor

        double parseExpression() {
            double x = parseTerm();
            for (;;) {
                if      (eat('+')) x += parseTerm(); // addition
                else if (eat('-')) x -= parseTerm(); // subtraction
                else return x;
            }
        }

        double parseTerm() {
            double x = parseFactor();
            for (;;) {
                if      (eat('*')) x *= parseFactor(); // multiplication
                else if (eat('/')) x /= parseFactor(); // division
                else return x;
            }
        }

        double parseFactor() {
            if (eat('+')) return parseFactor(); // unary plus
            if (eat('-')) return -parseFactor(); // unary minus

            double x;
            int startPos = this.pos;
            if (eat('(')) { // parentheses
                x = parseExpression();
                eat(')');
            } else if ((ch >= '0' && ch <= '9') || ch == '.') { // numbers
                while ((ch >= '0' && ch <= '9') || ch == '.') nextChar();
                x = Double.parseDouble(str.substring(startPos, this.pos));
            } else if (ch >= 'a' && ch <= 'z') { // functions
                while (ch >= 'a' && ch <= 'z') nextChar();
                String func = str.substring(startPos, this.pos);
                x = parseFactor();
                if (func.equals("sqrt")) x = Math.sqrt(x);
                else if (func.equals("sin")) x = Math.sin(x);
                else if (func.equals("cos")) x = Math.cos(x);
                else if (func.equals("tan")) x = Math.tan(x);
                else if (func.equals("log")) x = Math.log(x);
                else throw new RuntimeException("Unknown function: " + func);
            } else {
                throw new RuntimeException("Unexpected: " + (char)ch);
            }

            if (eat('^')) x = Math.pow(x, parseFactor()); // exponentiation

            return x;
        }
    }.parse();
}

    public static void main(String[] arg) {
        try {
            System.out.println( "" + Evaluate.arithematic(".6*0.0 + .4*2")); 
        }
        catch (Exception e) {
            Toolbox.println(0, e.toString());
        }
    }
}
