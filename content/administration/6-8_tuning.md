+++
title = "Tuning"
weight = 8
+++

After installation, the following settings are necessary in order to operate GridDB.

1.  Network environment settings
2.  Cluster name settings

GridDB settings are configured by editing 2 types of definition files.

*   Cluster definition file (gs_cluster.json)
*   Node definition file (gs_node.json)

The cluster definition file defines the parameters that are common in the entire clusters.

The node definition files define the parameters for the different settings in each node.

These definition file samples are installed as follows.

/usr/gridstore/                     # installation directory
               conf/                # definition file directory
                    gs_cluster.json # cluster definition file sample
                    gs_node.json    # node definition file sample

In a new installation, the same files are also placed in the conf directory under the GridDB home directory.

/var/lib/gridstore/                     # GridDB home directory
                   conf/                # definition file directory
                        gs_cluster.json # (edited) cluster definition file
                        gs_node.json    # (edited) node definition file

During operations, edit these definition files.

**\[Points to note\]**

*   When the GridDB version is upgraded, compare the newly installed sample with these definition files to adequately reflect the parameters added.
*   A cluster definition file defines the parameters that are common in the entire clusters. As a result, the settings must be the same in all of the nodes in the cluster. Nodes with different settings will get an error upon joining the cluster and prevented from participating in the cluster. Further details will be explained in the later chapter.

### Network environment settings (essential)

First, set up the network environment.

An explanation of the recommended configuration method in an environment that allows a multicast to be used is given below. In an environment which does not allow a multicast to be used, or an environment in which communications between fellow nodes cannot be established in a multicast, a cluster configuration method other than the multicast method has to be used. See [Other cluster configuration method settings](#other_mode) for the details.

The configuration items can be broadly divided as follows.

1.  Address information serving as an interface with the client
2.  Address information for cluster administration and processing
3.  Address information serving as an interface with the JDBC client (GridDB Advanced Edition only)

Although these settings need to be set to match the environment, default settings will also work.

However, an IP address derived in reverse from the host name of the machine needs to be an address that allows it to be connected from the outside regardless of whether the GridDB cluster has a multiple node configuration or a single node configuration.

Normally, this can be set by stating the host name and the corresponding IP address in the /etc/hosts file.

**/etc/hosts setting**

First, check with the following command to see whether the setting has been configured. If the IP address appears, it means that the setting has already been configured.

$ hostname -i
192.168.11.10

The setting has not been configured in the following cases.

$ hostname -i
hostname: no address corresponding to name

In addition, a loopback address that cannot be connected from the outside may appear.

$ hostname -i
127.0.0.1

If the setting has not been configured or if a loopback address appears, use the following example as a reference to configure /etc/hosts. The host name and IP address, and the appropriate network interface card (NIC) differ depending on the environment.

1.  Check the host name and IP address.
    
    $ hostname
    GS_HOST
    $ ip route | grep eth0 | cut -f 12 -d " " | tr -d "\\n"
    192.168.11.10
    
2.  Add the IP address and corresponding host name checked by the root user to the /etc/hosts file.
    
    192.168.11.10 GS_HOST
    
3.  Check that the settings have been configured correctly.
    
    $ hostname -i
    192.168.11.10
    

*If the displayed setting remains the same as before, it means that a setting higher in priority is given in the /etc/hosts file. Change the priority order appropriately.

Proceed to the next setting after you have confirmed that /etc/hosts has been configured correctly.

**(1) Address information serving as an interface with the client**

In the address data serving as an interface with the client, there are configuration items in the **node definition file** and **cluster definition file**.

**Node definition file**

  

Parameters

Data type

Meaning

/transaction/serviceAddress

string

Reception address of transaction process

/transaction/servicePort

string

Reception port of transaction process

/system/serviceAddress

string

Connection address of operation command

/system/servicePort

string

Connection port of operation command

The reception address and port of transaction processes are used to connect individual client to the nodes in the cluster, and to request for the transaction process from the cluster. This address is used when configuring a cluster with a single node, but in the case where multiple nodes are present through API, the address is not used explicitly.

The connection address and port of the operating command are used to specify the process request destination of the operation command, as well as the repository information of the integrated operation control GUI.

These reception/connection addresses need not be set so long as there is no need to use/separate the use of multiple interfaces.

**Cluster definition file**

  

Parameters

Data type

Meaning

/transaction/notificationAddress

string

Interface address between client and cluster

/transaction/notificationPort

string

Interface port between client and cluster

A multi-cast address and port are specified in the interface address between a client and cluster. This is used by a GridDB cluster to send cluster information to its clients and for the clients to send processing requests via the API to the cluster. See the description of GridStoreFactory class/method in “GridDB API reference” ([GridDB\_API\_Reference.html](/en/docs/manuals/v3.1/GridDB_API_Reference.html)) for details.

It is also used as a connection destination address of the export/import tool, or as repository data of the integrated operation control GUI.

**(2) Address information for cluster administration and processing**

In the address data for a cluster to autonomously perform cluster administration and processing, there are configuration items in the **node definition file** and **cluster definition file**. These addresses are used internally by GridDB to exchange the heart beat (live check among clusters) and information among the clusters. These settings are not necessary so long as the address used is not duplicated with other systems on the same network or when using multiple network interface cards.

**Node definition file**

  

Parameters

Data type

Meaning

/cluster/serviceAddress

string

Reception address used for cluster administration

/cluster/servicePort

string

Reception port used for cluster administration

**Cluster definition file**

  

Parameters

Data type

Meaning

/cluster/notificationAddress

string

Multicast address for cluster administration

/cluster/notificationPort

string

Multicast port for cluster administration

*   Although a synchronization process is carried out with a replica when the cluster configuration is changed, a timeout time can be set for the process.
    *   /sync/timeoutInterval

**\[Points to note\]**

*   An address or port that is not in use except in GridDB has to be set.
*   The same address can be set for the node definition file gs_node.json /transaction/serviceAddress, /system/serviceAddress, and /cluster/serviceAddress for operations to be performed. If a machine has multiple network interfaces, the bandwidth can be increased by assigning a separate address to each respective interface.

The following settings are applicable in the GridDB Advanced Edition only.

**(3) Address information serving as an interface with the JDBC client**

In the address data serving as an interface with the JDBC/ODBC client, there are configuration items in the **node definition file** and **cluster definition file**.

**Node definition file**

  

Parameters

Data type

Meaning

/sql/serviceAddress

string

Reception address for JDBC/ODBC client connection

/sql/servicePort

int

Reception port for JDBC/ODBC client connection

The reception address and port of JDBC/ODBC client connection are used to connect JDBC/ODBC individual client to the nodes in the cluster, and to access the cluster data in SQL. This address is used when configuring a cluster with a single node, but in the case where multiple nodes are present through API, the address is not used explicitly.

**Cluster definition file**

  

Parameters

Data type

Meaning

/sql/notificationAddress

string

Address for multi-cast distribution to JDBC/ODBC client

/sql/notificationPort

int

Multicast port to JDBC/ODBC client

The address and port used for multicast distribution to a JDBC/ODBC client are used for the GridDB cluster to notify the JDBC/ODBC client of cluster data, and to access the cluster data in SQL with the JDBC/ODBC client.

Refer to Annex [Parameter List](#param_list) for the other parameters and default values.

### Cluster name settings (essential)

Set the name of the cluster to be composed by the target nodes in advance. The name set will be checked to see if it matches the value specified in the command to compose the cluster. As a result, this prevents a different node and cluster from being composed when there is an error in specifying the command.

The cluster name is specified in the following configuration items of the **cluster definition file**.

**Cluster definition file**

  

Parameters

Data type

Meaning

/cluster/clusterName

string

Name of cluster to create

**\[Points to note\]**

*   Node failed to start with default value ("").
*   A unique name on the sub-network is recommended.
*   A cluster name is a string composed of 1 or more ASCII alphanumeric characters and the underscore “_”. However, the first character cannot be a number. The name is also not case-sensitive. In addition, it has to be specified within 64 characters.

### Settings of other cluster configuration methods

In an environment which does not allow the multicast method to be used, configure the cluster using the fixed list method or provider method. An explanation of the respective network settings in the fixed list method and provider method is given below.

When using the multicast method, proceed to [Setting the tuning parameters](#tune-up_params).

**(1) Fixed list method**

When a fixed address list is given to start a node, the list is used to compose the cluster.

When composing a cluster using the fixed list method, configure the parameters in the cluster definition file.

**Cluster definition file**

  

Parameters

Data type

Meaning

/cluster/notificationMember

string

Specify the address list when using the fixed list method as the cluster configuration method.

A configuration example of a cluster definition file is shown below.

{
                             :
                             :
    "cluster":{
        "clusterName":"yourClusterName",
        "replicationNum":2,
        "heartbeatInterval":"5s",
        "loadbalanceCheckInterval":"180s",
        "notificationMember": \[
            {
                "cluster": {"address":"172.17.0.44", "port":10010},
                "sync": {"address":"172.17.0.44", "port":10020},
                "system": {"address":"172.17.0.44", "port":10040},
                "transaction": {"address":"172.17.0.44", "port":10001},
                "sql": {"address":"172.17.0.44", "port":20001}
            },
            {
                "cluster": {"address":"172.17.0.45", "port":10010},
                "sync": {"address":"172.17.0.45", "port":10020},
                "system": {"address":"172.17.0.45", "port":10040},
                "transaction": {"address":"172.17.0.45", "port":10001},
                "sql": {"address":"172.17.0.45", "port":20001}
            },
            {
                "cluster": {"address":"172.17.0.46", "port":10010},
                "sync": {"address":"172.17.0.46", "port":10020},
                "system": {"address":"172.17.0.46", "port":10040},
                "transaction": {"address":"172.17.0.46", "port":10001},
                "sql": {"address":"172.17.0.46", "port":20001}
            }
        \]
    },
                             :
                             :
}

**(2) Provider method**

Get the address list supplied by the address provider to perform cluster configuration.

When composing a cluster using the provider method, configure the parameters in the cluster definition file.

**Cluster definition file**

  

Parameters

Data type

Meaning

/cluster/notificationProvider/url

string

Specify the URL of the address provider when using the provider method as the cluster configuration method.

/cluster/notificationProvider/updateInterval

string

Specify the interval to get the list from the address provider. Specify a value that is 1s or higher and less than 2^31s.

A configuration example of a cluster definition file is shown below.

{
                             :
                             :
    "cluster":{
        "clusterName":"yourClusterName",
        "replicationNum":2,
        "heartbeatInterval":"5s",
        "loadbalanceCheckInterval":"180s",
        "notificationProvider":{
            "url":"http://example.com/notification/provider",
            "updateInterval":"30s"
        }
    },
                             :
                             :
}

The address provider can be configured as a Web service or as a static content. The specifications below need to be satisfied.

*   Compatible with the GET method.
*   When accessing the URL, the node address list of the cluster containing the cluster definition file in which the URL is written is returned as a response.
    *   Response body: Same JSON as the contents of the node list specified in the fixed list method
    *   Response header: Including Content-Type:application/json

An example of a response sent from the address provider is as follows.

$ curl http://example.com/notification/provider
\[
    {
        "cluster": {"address":"172.17.0.44", "port":10010},
        "sync": {"address":"172.17.0.44", "port":10020},
        "system": {"address":"172.17.0.44", "port":10040},
        "transaction": {"address":"172.17.0.44", "port":10001},
        "sql": {"address":"172.17.0.44", "port":20001}
    },
    {
        "cluster": {"address":"172.17.0.45", "port":10010},
        "sync": {"address":"172.17.0.45", "port":10020},
        "system": {"address":"172.17.0.45", "port":10040},
        "transaction": {"address":"172.17.0.45", "port":10001},
        "sql": {"address":"172.17.0.45", "port":20001}
    },
    {
        "cluster": {"address":"172.17.0.46", "port":10010},
        "sync": {"address":"172.17.0.46", "port":10020},
        "system": {"address":"172.17.0.46", "port":10040},
        "transaction": {"address":"172.17.0.46", "port":10001},
        "sql": {"address":"172.17.0.46", "port":20001}
    }
\]

**\[Memo\]**

*   Specify the serviceAddress and servicePort of the node definition file in each module (cluster,sync etc.) for each address and port.
*   SQL items are required in the GridDB Advanced Edition only.
*   Set either the /cluster/notificationAddress, /cluster/notificationMember, /cluster/notificationProvider in the cluster definition file to match the cluster configuration method used.
*   See “GridDB technical reference” ([GridDB_TechnicalReference.html](/en/docs/manuals/v3.1/GridDB_TechnicalReference.html)) for details on the cluster configuration method.

### Setting the tuning parameters

The main tuning parameters are described here. These parameters are not mandatory but affect the processing performance of the cluster.

### Parameter related to update performance

GridDB creates a transaction log file and checkpoint file for persistency purposes. As data written in these files has an impact on the update performance, the method of creation can be changed by the following parameters. However, the disadvantage is that the possibility of data being lost during a failure is higher.

The related parameters are shown below.

**Node definition file**

  

Parameters

Data type

Meaning

/dataStore/persistencyMode

string

Persistency mode

/dataStore/logWriteMode

int

Log write mode

The persistency mode specifies whether to write data to a file during a data update. The log write mode specifies the timing to write data to the transaction log file.

Either one of the values below can be set in the persistency mode.

*   "NORMAL"
*   "KEEP\_ALL\_LOGS"

A "NORMAL" writes data to the transaction log file and checkpoint file every time there is an update. A transaction log file which is no longer required will be deleted by a checkpoint. The write timing of "KEEP\_ALL\_LOGS" is the same as "NORMAL" but all transaction log files are retained. Default value is "NORMAL".

**\[Points to note\]**

*   When performing a differential backup, set the persistency mode to "NORMAL".

Either one of the values below can be set in the log write mode.

*   0: SYNC
*   An integer value of 1 or higher1: DELAYED_SYNC

In the "SYNC" mode, log writing is carried out synchronously every time an update transaction is committed or aborted. In the "DELAYED\_SYNC" mode, log writing during an update is carried out at a specified delay of several seconds regardless of the update timing. Default value is "1 (DELAYED\_SYNC 1 sec)".

### Parameter related to performance and availability

By composing a cluster, GridDB can replicate data in multiple nodes to improve the search performance and availability. As replication of these data has an impact on the update performance, the method of creation can be changed by the following parameters. However, the disadvantage is that the possibility of data being lost during a failure is higher.

The related parameters are shown below.

**Cluster definition file**

  

Parameters

Data type

Meaning

/transaction/replicationMode

int

Replication mode

The replication mode specifies how to create a replica. The replication method has to be same for all nodes in the cluster .

*   "0": Asynchronous replication
*   "1": Semi-synchronous replication

"Asynchronous replication" performs replication without synchronizing the timing of the update process. "Semi-synchronous replication" performs replication synchronously at the timing of the update process timing but makes no appointment at the end of the replication. Default is "0".

### Parameter related to access performance immediately after startup

Data perpetuated on a disk etc. can be loaded into the memory at the same time when a node is started (warm start process).

The warm start process can be enabled/disabled by the parameter below.

**Node definition file**

  

Parameters

Data type

Meaning

/dataStore/storeWarmStart

boolean

Start processing mode

*   false: non-warm start mode
*   true: warm start mode

Default is true (valid).

### Other parameters

An explanation of the other parameters is given. See Annex [Parameters list](#param_list) for the default values.

**Node definition file**

  

Parameters

Data type

Meaning

/dataStore/dbPath

string

Database file directory

/dataStore/backupPath

string

Backup file directory

/dataStore/storeMemoryLimit

string

Memory buffer size

/dataStore/concurrency

int

Processing parallelism

/dataStore/affinityGroupSize

int

No. of data affinity groups

/checkpoint/checkpointInterval

int

Checkpoint execution interval (unit: sec)

/system/eventLogPath

string

Output directory of event log file

/transaction/connectionLimit

int

No. of connections upper limit value

/trace/category

string

Event log output level

*   A database file directory is created when the data registered in the in-memory is perpetuated. In this directory, the transaction log file and checkpoint files are created.
*   A backup file directory is created when a backup is executed (further details will be explained in the subsequent chapters). In this directory, the backup file is stored.
*   The memory buffer size is used for data management. To set the memory size, simply use numbers and text to specify the memory size and its unit respectively. E.g. “2048MB”.
*   Processing parallelism refers to the upper limit value for GridDB to perform I/O processing of the secondary memory device in parallel.
*   With regards to data affinity, related data are collected, and the number of groups is specified during layout management.
*   Any number from 1 to 64 can be selected when specifying the number of groups. Please note though that the larger the group, the lower the memory utilization efficiency becomes.
*   The checkpoint execution interval is the interval to execute an internal checkpoint process regularly (related to the perpetuation of data).
*   The output directory of event log is the directory where messages (event message files) related to event data occurring inside a node such as exceptions etc, will be saved into.
*   As a rule of thumb, please set the no. of connection upper limit to at least twice the number of expected clients.
*   The event log output level is the output level for each category of the event log.
