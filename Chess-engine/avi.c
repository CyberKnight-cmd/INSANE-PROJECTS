# include "stdio.h"
#include "defs.h"
int main(){
    AllInit();

    for(int i = 0; i < BRD_SQ_NUM; i++){
        if(i%10 == 0) printf("\n");
        printf("%5d", Sq120ToSq64[i]);
    }
    printf("\n");
    printf("\n");

    for(int i = 0; i < 64; i++){
        if (i%8==0) printf("\n");
        printf("%5d", Sq64ToSq120[i]);
    }
    return 0;
}