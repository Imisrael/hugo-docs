+++
title = "ODBC Connector"
weight = 2
+++

#### Operating Environment

The ODBC driver used in GridDB AE (Advanced Edition) can be used with the following operating systems:

*   Windows Server 2012 R2
*   Windows Server 2008 R2
*   Windows 8
*   Windows 7

Overview of ODBC

ODBC (Open Database Connectivity) is a standard interface for accessing database management systems (DBMS) from Windows-compatible applications advocated by Microsoft

*   ODBC-compatible application (Windows)
For ODBC functions invoked from an ODBC-compatible application, the OS will control the connection to a specific database of the specified ODBC data source. In addition, management of the data source is also carried out.  
  
*   ODBC driver for GridDB AE (Windows)
This is a unique driver that can be used to connect to GridDB AE. 32-bit and 64-bit versions are available and should be chosen carefully based on the application.  
  
*   GridDB Cluster (Linux)
This is a GridDB AE Cluster operating in Linux OS on another machine

### Installation Method

The ODBC driver for GridDB AE is included in the "/Windows/ODBC" directory of the installation media.

The installation method is as follows.

*   When installing a 32-bit driver

1.  Select the "GridStoreODBC\_32bit\_setup.bat", right-click, and select "Run as administrator"
2.  Check that GridStoreODBC32.dll has been copied to the program c://Program Files/TOSHIBA/GridStore/bin directory

#### Registration of ODBC data source

In order to access the GridDB AE database using GridDB ODBC, it is necessary to register the ODBC data source in advance. Registration of the ODBC data source is performed with the following procedure:

*   **For 64-bit**

1.  For Windows 7/Windows 2008, start \[Data source\] (ODBC) from the \[Management tools\].  
    For Windows 8/Windows 2012, start \[ODBS dats source (64-bit)\] from the \[Management tools\]
  
3.  Create a system data source (system DSN)
5.  Set up the connection data to the GridDB cluster when the GridStore ODBC setup screen appears.

#### Input Items

*   "Data source": specify the data source name ot be registered to the ODBC driver manager. The application will specify the data source name specified here to connect to the GridDB cluster.
*   "Multicase Address": Specify the multicast address used to connect to the GridDB cluster. Default is 239.0.0.1. Value of "sql/notificationAddress" in the cluster definition file (gs_cluster.json) of th eGridDB node needs to be specified.
*   "Port number": Refers to the port number used to connect to GridDB cluster. Default is 41999. Value of "sql/notificationPort" in the cluster definittion file (gs_cluster.json) of the GridDB node needs to be specified.
*   "Cluster name": Refers to the cluster name of the GridDB cluster. Value of "cluster/clusterName" in the cluster definition file (gs_cluster.json) of the GridDB node needs to be specified.
*   "User Name": Refers to the user name connected to GridDB cluster.
*   "Password": Refers to the password of the user mentioned above

#### Buttons

*   "Test connection": Check the connection to the GridDB cluster.
*   "Save": Save the configurations to the registry and close the dialog.
*   "Cancel": Discard any changes made.

*   **For 32-bit**

1.  For Windows 7/Windows 2008, star the command prompt as adminstrator, and run the 32-bit version of ODBC adminstrator (odbcad32.exe).

 Storage location: /windir/SysWOW64/odbcad32.exe
  
 Example: c:/WINDOWS/SysWOW64.odbcad32.exe

**\[Attention\]**  
If \[Data source (ODBC) is started from the \[Management tools\] in a 64-bit OS, the 64-bit ODBC adminstrator will be started and it will not be possible to configure the 32-bit settings.  
  
For Windows 8/Windows 2012, start \[ODBS data source (32-bit)\] from the \[Management tools\].

4.  Create a system data source (system DSN)
  
*Select "GridStore ODBC (x86)" when specifying the driver.  
  
8.  Set up the connection data to the GridDB server in the GridStore ODBC setup screen. The configuration method is the same as the 64-bit version

*The database at the connection destination will serve as the default public database. A database cannot be specified by the ODBC driver.

*Only GridDB clusters configured with the multicast method can be connected.

### Connection Method

If a business intelligence/ETL tool is used, please specify the data source name set in the "GridStore ODBC setup screen".

If the ODBC API is used, specify the data source name set in the "GridStore ODBC setup screen" as well.  
  
Example: Specify in the second argument for SQLConnect functions.  

SQLConnect(hdbc, (SQLTCHAR *) TEXT("GridStoreODBC-DB1"), SQL\_NTS, (SQLTCHAR *) TEXT(""), SQL\_NTS, (SQLTCHAR*) TEXT("") SQL_NTS);

### Samples

Sample programs in the C language using ODBC API and VisualStudio project files are included in the file "gridstore-odbc-sample.zip". (These are stored under Windows in the installation media.)

The samples are written and tested (operation check in VisualStudio 2005 SP1)

*   GridStoreODBC-sample.sln: VisualStudio solution file
*   ODBC-sample/GridStoreODBC-sample.cpp: Sample Source
*   GridStoreODBC-sample.vcproj: Project file

Try to perform table creation, data registration, and search. The project settings are configured for 64-bit and 32-bit use.

The following ODBC data source settings are required to execute a program.

**For 64-bit**  
Data source name: GridStoreODBC-test64bit

**For 32-bit**  
Data source name: GridStoreODBC-test32bit
