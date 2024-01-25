%{
    #undef yywrap
    #define yywrap() 1
%}

%%
^[aA].*[aA]$ {
    printf("%s\n", yytext);
    fprintf(yyout, "%s\n", yytext);
}
. {

}
%%

int main()
{

    yyin = fopen("input.txt", "r");
    yyout = fopen("output.txt", "w");
    yylex();
    fclose(yyin);
    fclose(yyout);
}
