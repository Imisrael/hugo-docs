+++
title = "JDBC Connector"
weight = 1
+++

### Overview of GridDB AE JDBC driver

An interface that can access GridDB data using SQL is provided in the GridDB Advanced Edition (GridDB AE). This chapter provides an overview and specifications of the Java API (JBDC) used to access databases supported by the GridDB AE.

This chapter also consists of a description of the specified format and data types that can be used in a program using JDBC parameters, and the points to note during use.

### Connection Method

#### Operating Environment Requirements

GridDB AE can be run on the 64-bit OS of RHEL 6.2/6.3/6.4/6.5, and CentOS 62./6.3/6.4/6.5.  
JDBC driver can be used with the 64-bit OS of RHEL 6.2/6.3/6.4/6.5, CentOS 62./6.3/6.4/6.5, and Windows 7. In addition, please check whether JDK6/7 has been installed as the development environment of the Java language.

#### Driver Specification

Add the JDBC driver file gridstore-jdbc.jar to the class path. When added, the driver will be registered automatically. The JDBC driver file has been installed under /usr/share/java by default. In addition, import the driver class as follows if necessary (normally not required).  

Class.forName("com.toshiba.mwcloud.gs.sql.Driver");

#### URL Format When Connected

The URL format is as follows. If the multicast method is used to create a cluster, it is normally connected using method (A). The load will be automatically distributed on the GridDB cluster side and the appropriate nodes will be connected. Connect using method (B) only if multicast communication with the GridDB cluster is not possible.

(A) If connecting automatically to a suitable node in a GridDB cluster using the multicast method:

jdbc:gs//(multicastAddress):(portNo)/(clusterName)/(databaseName)

**multicastAddress:** Multicast address used in conecting with a GridDB cluster. (Default is 239.0.0.1)**  
PortNo:** Port number used in connecting with a GridDB cluster. (Default is 41999)**  
clusterName:** Cluster name of GridDB cluster**  
databaseName:** Database name. Connect to the default database if omitted.  
*multicastAddress, portNo can be amended by editing the gs_cluster.json file.

(B) If connecting directly to a node in a GridDB cluster using the multicast method

jdbc:gs:///(nodeAddress):(portNo)/(clusterName)/(databaseName)

**nodeAddress:** Address of node  
**portNo:** Port number used in connecting with a node Default value is 20001  
**clusterName:** Cluster name of GridDB cluster that the node belongs to  
**databaseName:** Database name. Connect to the default database if omitted.

*Default values of nodeAddress, portNo can be amended by editing the gs_node.json file.  
*If the fixed list method is used to compose a cluster, use method (C) to connect.

(C) If connecting to a GridDB cluster using the fixed list method

jdbc:gs:///(clusterName)/(databaseName)?notificationMember=(notificationMember)

**clusterName:** Cluster name of GridDB cluster  
**databaseName:** Database name. Connect to the default database if omitted.  
**notificationMember:** Address list of node(URL encoding required). Default port is 20001.  
  
Example: 192.168.0.10:20001, 192.168.0.11:20001, 192.168.0.12:20001  
  
*notificationMember can be amended by editing the gs_cluster.json file.  
Port used in the address list can be amended by editing the gs_node.json file

If the provider method is used to compose a cluster, use method (D) to connect.

(D) if connecting to a GridDB cluster using the provider method.

jdbc:gs:///(clusterName)/(databaseName)?notificationProvider=(notificationProvider)

**clusterName:** Cluster name of GridDB cluster  
**databaseName:** Database name. Connect to the default database if omitted.  
**notificationProvider:** URL of address provider (URL encoding required)  
  
*notificationProvider can be amended by editing the gs_cluster.json file.

If the user name and password are going to be included in the URL in any of the cases, (A) to (D), add them at the end of the URL as shown below. ?user=(user name)&password=(password)

#### Connection Timeout Settings

The connection timeout can be set in either of the methods (1) and (2). Setting (2) is prioritized if both (1) and (2) are set. A defalut value of 300 seconds (5 minutes) is used if neither (1) or (2) has been set, or if there are no settings at all.

(1) Specify with the DriverManager#setLoginTimeout (int seconds) The value in seconds is set as follows.

*   If the value is 1 to Integer.MAX_VALUE

*   Set by the specified number of seconds

*   If the value is Integer.MIN_VALUE to 0

*   Not set

After setting, connection timeout will be set in the connections to all the GridDB AE acquired by the DriverManager#getConnection or Driver#connect.

(2) Specify with DriverManager#getConnection (String url, Properties info) or Driver#connect (String url, Properties info)

Add a property to argument info in the key "loginTimeout". If the value corresponding to the key "loginTimeout" can be converted to a numerical value, the connection timeout will be set in the connection obtained as follows.

*   If the converted value is 1 to Integer.MAX_VALUE

*   Set by the specified number of seconds

*   If the value is Integer.MIN_VALUE to 0

*   Not Set

#### Observations

*   A container created by GridDB SE (Standard Edition) client can be referenced as a table by the GridDB AE JDBC driver but it cannot be updated. Besides updating the rows, changes in the schema and index of a container are also included in an update. Conversely, a table created with the GridDB AE JDBC driver can neither be referenced nor updated from a GridDB SE client.
    

*   If a TimeSeries container created by a GridDB client is searched with a SQL command from the GridDB AE, the results will not be in chronological order if no ORDER BY phrase is specified for the main key. Specify an ORDER BY against the main key if a chronological series of the SQL results is required.

*   Regarding consistency during a search, the way the results are viewed may differ between a search conducted from a GridDB SE client and a search conducted from a GridDB AE JDBC driver. As GridDB supports READ COMMITTED as an isolation level of the trasnaction, data committed at the point search is started will be read in a search. If a search is conducted from a GridDB SE client, since each search request is read once in the prcoess, only data committed at the point the search is started will be searched as per READ COMMMITTED. On the other hand, if a search is conducted with a SQL command from a GridDB AE JDBC driver, the requested SQL may be read and processed several times. In this case, the respective readings will become READ COMMITTED. As a result, when a transaction of another client is committed, in-between the readings the update details are ready by the next reading and the entire SQL may not become READ COMMITTED.

*   When the number of SQL hits is large, the error "memory limit exceed" may occur. In this case, add the descriptions of parameter transaction:totalMemoryLimit and dataStore:resultSetMemoryLimit in the gs_node.json file as shown below, and expand the upper limit value of the memory used in the SQL process. However, the names of these parameters may be changed or deleted in future versions.

Example: when specifying the upper limit value

"transaction":{
    "totalMemoryLimit":"2048MB"
}

"dataStore":{
    "resultSetMemoryLimit":"20480MB"
}

*Default value is 1024MB and 10240 MB respectively if there is no description.

### Specifications of GridDB AE JDBC Driver

The specifications of the GridDB AE JDBC Driver are shown in this section. This section explains mainly the support range of the driver as well as the differences with the JDBC standard. See the JDK API reference for the API specifications that conform to the JDBC standard unless otherwise stated.  
  
Please note that the following could be revised in the future versions.

*   Actions not conforming to the JDBC standard
*   Support status of unsupported functions
*   Error messages

### Common Items

#### Supported JDBC Version

The following functions corresponding to some of the functions of JDBC 4.1 are not supported.

*   Transaction control
*   Stored procedure
*   Error processing

#### Use of Unsupported Functions

*   Standard Functions
    
    A SQL FeatureNotSupportedException occurs if a function that ought to be but is currently not supported by a driver conforming to the JDBC specifications is used. This action differs from the original SQLFeatureNotSupportException specifications. Error name (to be described later) is JDBC\_NOT\_SUPPORTED.
    
*   Optional Functions
    
    If a function not supported by the driver that is positioned as an optional function in the JDBC specifications and for which a SQLFeatureNotSupportedException may occur is used, a SQLFeatureNotSupportedException will occur as per the JDBC specifications. Error name is JDBC\_OPTIONAL\_FEATURE\_NOT\_SUPPORTED.
    

#### Invoke A Method Against A Closed Object

As per the JDBC specifications, when a method other than isClosed() is invoked for an object that has a close() method, e.g. a conection object, etc. a SQL Exception will occur. Error name is JDBC\_ALREADY\_CLOSED

#### Invalid Null Argument

If null is specified as the API method argument despite not being permitted, a SQLException due to a JDBC\_EMPTY\_PARAMETER error will occur. Null is not permitted except for arguments which explicitly accepts null in the JDBC specifications

#### If There Are Multiple Error Causes

If there are multiple error causes, control will be returned to the application at the point either one of the errors is detected. In particular, if use of an unsupported function is attempted, it will be detected earlier than other errors. For example, if there is an attempt to create a stored procedure for a closed connection object an error indicating that the operation is "not supported" instead of "closed" will be returned.

#### Description Of Exception

A check exception thrown from the driver is made up of a SQLException or a subclass instance of the SQLException

Use of the following method to get the exception details.

*   getErrorCode()  
    For errors detected by GridDB in either the server or client, an error number will be returned. See the list of error codes for the specifc number and cause.
*   getSQLState()  
    Corresponding SQLSTATE is returned if an error is detected in the SQL process or JDBC driver. null is returned otherwise.
*   getMessage()  
    Return an error message containing the error number and error description as a set. The format is as follows.

\[(Error number): (Error code name)\] (Supplementary message)

### Sample

A JDBC sample program is given below:

import java.sql*

public class SampleJDBC{
    public static void main (String\[\] args) throws SQLException {
        String url = null, user = "", password = "";
        
        if (args.length != 3) {
            System.err.println (
                "usage: java SAmple JDBC (multicastAddress)(port)(clusterName)");
            System.exit(1)
        }
        // url is "jdbc:gs:// (multicastAddress): (portNo)/(clusterName)" format
        url = "jdbc:gs://" + args\[0\] + ":" + args\[1\] + "/" + args\[2\];
        user = "system";
        password = "manager";
        
        System.out.println("DB Connection Start");
        
        // Connection with GridDB Cluster
        Connection con = DriverManager.getConnection (url, user, password);
        try{
            System.out.println("Start");
            Statement st = con.createStatement();
            ResultSet rs = con.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM table01");
            ResultSetMetaData md = rs.getMetaData();
            while (rs.next()){
                for (int 1 = 0; i < md.getColumnCount(); i++) {
                    System.out.print(rs.getStrng(i + 1) + "|");
                }
                System.out.println("");
            }
            rs.close();
            System.out.println("End");
            st.close ();
        }
        finally {
            System.out.println("DB Connection Close");
            con.close();
        }
    }
}
