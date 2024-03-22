%{

int total =0 ;

%}

%option noyywrap

%%

#.* {total++; fprintf(yyout," Pre-processor directive: %s\n\n",yytext);}

[(|)|{|}] {total++; fprintf(yyout," Delimiter: %s\n\n",yytext);}

"="  {total++; fprintf(yyout," Assignment Operator: %s\n\n",yytext);}

("Int") {total++; fprintf(yyout," Keyword: %s\n\n",yytext);}

("Void")|("Printf") {total++;fprintf(yyout," Keyword:%s\n",yytext);}

[a-zA-Z_][a-zA-Z0-9_]* {total++; fprintf(yyout," Identifier: %s\n\n",yytext);}

[0-9]+ {total++; fprintf(yyout," Integer: %s\n\n",yytext);}

["]([^"\\\n]|\\.|\\\n)*["] {total++; fprintf(yyout," String:%s\n\n",yytext);}

. {fprintf(yyout,"",yytext);}

[\t\n]+

%%

main()
{
extern FILE *yyin, *yyout; 
  
    
    yyin = fopen("input.txt", "r"); 
  
   
    yyout = fopen("output.txt", "w"); 
  
    yylex();

	fprintf(yyout,"\n\n\n\n\n Total Tokens = %d",total);
	 

    return 0; 
}