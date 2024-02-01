%{
#undef yywrap
#define yywrap() 1
FILE *fptr;
%}

%%

[a-zA-Z] printf("%c", yytext[0] ^ 32);
"/*"(.|\n)*"*/" { printf("%s", yytext); }

%%

void main()
{

fptr= fopen("UpperComment_Text.txt","r");
yyin = fptr;
yylex();

}

