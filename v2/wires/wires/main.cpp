
#include <string.h>
#include <sys/wait.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <assert.h>
#include <cstdlib>
#include <iostream>
#include <iostream>
#include <fstream>

using namespace std;

string getRegister(string name)
{
 string green = "\033[32m";
 string red = "\033[22m";
 string cyan = "\033[36m";

 string result;
 char buffer[2048];
 string cmd = "cat " + name;
 FILE *stream = popen(cmd.c_str(), "r");
 fgets(buffer, 2048, stream);
 result += buffer;
 return result;
}
int main()
{
 string green = "\033[32m";
 string red = "\033[31m";
 string cyan = "\033[36m";
 string yellow = "\033[33m";
	
 string line;
 string currentValue;
 int counter = 0;
 system("sh /var/www/init");


 system("sh /var/www/off");

 while (true)
 {
        
        //if (counter > 0) counter = 0;
       	//cout << "sleeping" << endl;
  	usleep(1000000);  // wait for 0.1 seconds
        string result = getRegister("/var/www/lights");

        // system("sh /var/www/init");
        
	if (result != currentValue)
        {
                counter++;
                if (counter > 1000) counter = 0;
	        currentValue = result;

		if (result == "100")
	        {
        		system("sh /var/www/red");
			cout << yellow <<  counter <<  ":yellow" << endl;

	        }
		else if (result == "010")
		{
			system("sh /var/www/yellow");
			cout << red <<  counter << ":red" << endl;
		}
	        else if (result == "001")
        	{
                	system("sh /var/www/green");

	                cout << green <<  counter << ":green" << endl;
        	}
                else if (result == "000")
                {
                        system("sh /var/www/off");
                        cout << counter <<  ":All Off" << endl;
                }
         }
        //else
        //{
          //  cout << "clear" << endl;
           // system("sh ./off");
        //}

        result = "";
        
  }	

  return 0;
}




