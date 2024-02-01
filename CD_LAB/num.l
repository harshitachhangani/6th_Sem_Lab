%{
	#undef yywrap
	#define yywrap() 1
%}

%%
[0-9] {
    printf("Number: %s\n", yytext);
}

%%

int main()
{
	yylex();
}
