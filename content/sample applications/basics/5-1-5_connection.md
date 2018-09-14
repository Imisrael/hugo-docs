Table of Contents

5.1.5 Preparation: Connecting to GridDB
=======================================

Overview
--------

This section describes the connecting to and disconnecting from a GridDB server.

  

Connecting to GridDB
--------------------

In order to connect with the GridDB server, we use a Property class to set the connnection details which will be used by GridStoreFactory to open a connection. Refer to [Environment (server)](5-1-3_prepare-server.php) on what these settings are configured as in your envrionment.

**List.1 Connecting to a GridDB server** (GridDBLogic.java)

// Set the Connection parameter for GridDB
Properties props=new Properties ();
props.setProperty("host", "127.0.0.1");
props.setProperty("port", "10001");
props.setProperty("clusterName", "GSCLUSTER");
props.setProperty("database", "public");
props.setProperty("user", "admin");
props.setProperty("password", "admin");
GridStore store=GridStoreFactory.getInstance().getGridStore(props);

Parameters of GridDB connection are as follows.

L.24: `host` specifies the destination host name or IP address (IPV4 only).  
L.25: `port` specifies the destination port number.  
L.26: `clusterName` specifies the destination cluster name.  
L.27: `database` specifies the database name of the destination. This value is the default can be omitted is the "public".  
L.28: `user` Specifies the user name of GridDB server.  
L.29: `password` specifies the password of GridDB server.

For more information on the parameters other than the above, refer to the [GridDB API Reference](../GridDB_API_Reference.html).

  

### Cut from GridDB

After the application's GridDB tasks have completed, the connection should be closed.

**List.2 cut from GridDB**(CollectionCreate.java)

GridStore store=null;
try {
    // Processing to GridDB
    (Snip)
} finally {
    // Close Connection
    if (store!=null) {
        store.close ();
    }
}

L.8: Using close() within a try/finally block.

The following classes have a `close()` method that can terminate the connection with GridDB.

*   `GridStoreFactory`
*   `GridStore`
*   `Container`
*   `Query`
*   `RowSet`

  

### Source code

Complete source code used in this sample can be downloaded here:

Download: [container-create-drop.zip](img/container-create-drop.zip)
