# Cloud Node js Demo Part 1 

Pre-requisite  for this toolchain creation 

* Create your bluemix account , You need to have bluemix organization 
   url :http://ng.bluemix.net
* Create a github account 
   url : https://github.com
   
Once it is done, Now you have to press the following button , It will take you  to inside IBM Cloud , Now you have selected the respective Organization , Region Id ,space  , application name.

Once the application get deployed you have to check the deployed delivery pipeline and through this following url you can check the application 


You have to also analyze the node js code from the git hub 


## Create the toolchain

1. Ensure you have 2GB of free memory and space for 5 additional services in your organization.

1. It is recommended to create a new space in your organization. This helps grouping the apps and services together in the console.

1. **To get started, click this button:**

  [![Deploy To Bluemix](./.bluemix/create_toolchain_button.png)](https://new-console.ng.bluemix.net/devops/setup/deploy/?repository=https%3A//github.com/suddasgu/DreamHome_Node_Demo.git)

  Clicking it will:
  * **create 4 GitHub repositories** with the required source code for all the application components;
  * **instantiate the toolchain** in your Bluemix org and space;
  * **trigger the toolchain**, thereby deploying the selected branches (default to master) for all application components.


The toolchain is preconfigured for:

- issue tracking
- source control
- continuous delivery and integration (CI/CD)
- unit and code coverage testing
- blue-green deployment

---

### Learn more

* Bluemix DevOps Services: https://new-console.ng.bluemix.net/devops
* Documentation on [Bluemix Toolchains][toolchains_overview_url]

<!--Links-->
[bot_github_url]: https://github.com/IBM-Bluemix/insurance-bot
[orders_github_url]: https://github.com/IBM-Bluemix/insurance-orders
[catalog_github_url]: https://github.com/IBM-Bluemix/insurance-catalog
[dashboard_github_url]: https://github.com/IBM-Bluemix/insurance-bot-dashboard
[ios_github_url]: https://github.com/IBM-Bluemix/insurance-bot-ios
[android_github_url]: https://github.com/IBM-Bluemix/insurance-bot-android
[toolchains_overview_url]: https://new-console.ng.bluemix.net/docs/toolchains/toolchains_overview.html
[toolchains_interconnect_video_url]: https://vimeo.com/156126035/8b04b8878a
[garage_method_url]: https://www.ibm.com/devops/method
