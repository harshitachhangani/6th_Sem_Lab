%{
#include <stdio.h>
%}

%option noyywrap

%%

^[^a]*abb[^a]*$       { printf("Rejected\n"); yyterminate(); }
^.*abb.*$             { printf("Rejected\n"); yyterminate(); }
.                     { printf("Accepted\n"); yyterminate(); }

%%

int main() {
    yylex();
    return 0;
}
