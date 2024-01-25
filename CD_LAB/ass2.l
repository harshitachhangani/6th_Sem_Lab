%{
#include<stdio.h>
int sc=0,wc=0,lc=1,cc=0;
%}
%%
[\n] { lc++; cc+=yyleng;}
[ \t] { sc++; cc+=yyleng; }
[^\t\n ]+ { wc++; cc+=yyleng;}
%%
int main(int argc, char* argv[])
{
    if (argc==2) {
        yyin=fopen(argv[1], "r");
    }
    else{
        printf("Enter the Statement: ");
        yyin=stdin;
        }
        yylex();
        printf("The number of lines=%d\n",lc);
        printf("The number of spaces=%d\n",sc);
        printf("The number of words=%d\n",wc);
        printf("The number of characters are=%d\n",cc);
}
int yywrap()
{
    return 1;
}