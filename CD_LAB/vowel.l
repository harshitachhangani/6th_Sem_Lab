%{
#include <stdio.h>
#include <stdbool.h>

int vowelCount = 0;

bool checkOrder(char current) {
    const char vowels[] = "aeiou";
    if (current == vowels[vowelCount]) {
        vowelCount++;
        if (vowelCount == 5) {
            return true;
        }
    } else {
        vowelCount = (current == 'a') ? 1 : 0;
    }
    return false;
}

int yywrap(void) {
    return 1;
}
%}

%%

[a-z] {
    if (checkOrder(yytext[0])) {
        printf("Accepted: %s\n", yytext);
        // Reset count for the next string
        vowelCount = 0;
    }
}

.|\n {
    // Reject any character not matching the pattern
    printf("Rejected: %s\n", yytext);
}

%%

int main() {
    yylex();
    return 0;
}
