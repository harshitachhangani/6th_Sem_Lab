%{
#include <stdio.h>
%}

%%

(a\b)   { printf("(a\\b) pattern matched: %s\n", yytext); }
(a+b)   { printf("(a+b) pattern matched: %s\n", yytext); }

.       { /* Ignore other characters */ }

%%

int main() {
    yylex();
    return 0;
}
