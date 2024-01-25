%{
int in_comment = 0;
%}

%x COMMENT

%%
"/*" { if (!in_comment) printf("/*"); in_comment = 1; BEGIN(COMMENT); }
<COMMENT>"/*" { printf("%s", yytext); in_comment++; }
<COMMENT>"*/" { if (--in_comment == 0) BEGIN(INITIAL); printf("*/"); }
<COMMENT>[^\n]*"//" { printf("%s", yytext); }
<COMMENT>. { printf("%c", tolower(yytext[0])); }  /* Print characters in lowercase inside comments */

. { if (!in_comment) printf("%c", toupper(yytext[0])); }
%%

int yywrap(void) {}

int main(int argc, char **argv) {
    yylex();
    return 0;
}
