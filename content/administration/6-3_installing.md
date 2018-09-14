+++
title = "Installing"
weight = 3
+++

The following chapter will discuss how to install GridDB (Standard Edition). Instructions for installing on the cloud can be found [below](#online)

### On Premises

The following 3 RPM packages are needed when installing a GridDB node. Place these packages anywhere in the machine.

  

Package name

File name

Description

griddb-server

griddb-server-X.X.X-linux.x86_64.rpm

The start and other commands for the GridDB node module and server are included.

griddb-client

griddb-client-X.X.X-linux.x86_64.rpm

One set of operating commands except start node is included.

griddb-docs

griddb-docs-X.X.X-linux.x86_64.rpm

GridDB manual and program samples are included.

*: X.X.X is the GridDB version

Install using the rpm command as a root user.

$ su
\# rpm -Uvh griddb-server-X.X.X-linux.x86_64.rpm
Under preparation...           ########################################### \[100%\]
User gsadm and group gridstore have been registered.
GridStore uses new user and group.
   1:griddb-server                 ########################################### \[100%\]
\# rpm -Uvh griddb-client-X.X.X-linux.x86_64.rpm
Under preparation...           ########################################### \[100%\]
User and group has already been registered correctly.
GridStore uses existing user and group.
   1:griddb-client                  ########################################### \[100%\]
\# rpm -Uvh griddb-docs-X.X.X-linux.x86_64.rpm
Under preparation...           ########################################### \[100%\]
   1:griddb-docs                   ########################################### \[100%\]

When you install the package, the following group and user are created in the OS. This OS user is set as the operator of GridDB.

  

Group

User

Home directory

gridstore

gsadm

/var/lib/gridstore

The following environment variables are defined in this gsadm user.

  

Environment variables

Value

Meaning

GS_HOME

/var/lib/gridstore

gsadm/GridDB home directory

GS_LOG

/var/lib/gridstore/log

Event log file output directory

**\[Points to note\]**

*   These environment variables are used in the operating commands described later.
*   The password of the gsadm user has not been set. With the root user privilege, please set the password appropriately.
    *   Some of the functions of the operation tools may be necessary.

In addition, when the GridDB node module is installed, services that are executed automatically upon startup of the OS will be registered.

  

Service name

Run level

gridstore

3,4,5

The service registration data can be checked with the following command.

\# /sbin/chkconfig --list | grep gridstore
gridstore 0:off 1:off 2:off 3:on 4:on 5:on 6:off

The GridDB node will be started automatically by this service during OS startup.

**\[Points to note\]**

*   Services will not start automatically immediately after installation.

To stop auto startup of a service, use the command below.

\# /sbin/chkconfig gridstore off

See the chapter on services in “GridDB Operational Management Guide” ([GridDB_OperationGuide.html](https://griddb.net/en/docs/manuals/v3.1/GridDB_OperationGuide.html)) for details of the services.

#### Post-installation checks

Check the directory configuration of the installed GridDB node.

First, check that the GridDB home directory, and related directory and files have been created.

**GridDB home directory**

/var/lib/gridstore/                      # GridDB home directory
                   admin/                # integrated operational management GUI home directory
                   backup/               # backup directory
                   conf/                 # definition file directory
                        gs_cluster.json  # cluster definition file
                        gs_node.json     # node definition file
                        password         # user definition file
                   data/                 # database file directory
                   log/                  # log directory

Confirm with the following command.

$ ls /var/lib/gridstore/
admin backup conf data log

Next, check that the installation directory has been created

**Installation directory**

/usr/gridstore-X.X.X/              # installation directory
                     Fixlist.pdf   # revision record
                     Readme.txt    # release instructions
                     bin/          # operation command, module directory
                     conf/         # definition file sample directory
                     docs/         # document directory
                     etc/
                     lib/          # library directory
                     license/      # license directory
                     prop/         # configuration file directory
                     web/          # integrated operational management GUI file directory

Confirm with the following command.

$ ls /usr/gridstore-X.X.X/
Fixlist.pdf Readme.txt bin conf etc lib license prop web

All documents have been compressed into a single ZIP file. Decompress and refer to the documents where appropriate as shown below.

$ cd /usr/gridstore-X.X.X/docs
$ unzip griddb-documents-X.X.X.zip

In addition, the following symbolic links are created as shown below in a few directories under the installation directory for greater convenience.

$ ls /usr/gridstore/
conf lib prop web

Lastly, confirm the version of the server module installed with the following command.

$ gsserver --version
GridDB version X.X.X build XXXXX

**Points to note**

The following files are created when GridDB is operated according to the following procedure.

\[Database file\]

/var/lib/gridstore/                     # GridDB home directory
                   data/                # database file directory
                        gs\_log\_n_m.log  # log file to record the transaction logs (n, m are numbers)
                        gs\_cp\_n_p.dat   # checkpoint file to record data regularly (n, p are numbers)

\[Log file\]

/var/lib/gridstore/                            # GridDB home directory
                   log/                        # log directory
                       gridstore-%Y%m%d-n.log  # event log file
                       gs_XXXX.log             # operation tool log file

The directory where these files are created can be changed by the parameter settings in the node definition file.

*: gs\_XXXX is an operation tool name. (Example: gs\_startnode.log)

#### Setting up an Administrator User

Administrator privilege is used for authentication related matter within the nodes and clusters. Creation date of administrator user is saved in the **user definition file**. The default file is as shown below.

*   /var/lib/gridstore/conf/password

The default user below exists immediately after installation.

  

User

Password

Example of proper use

admin

admin

For authentication of operation administrator user, operation commands

system

manager

For authentication of application user, client execution

Administrator user information including the above-mentioned default users can be changed using the user administration command in the operating commands.

  

Command

Function

gs_adduser

Add an administrator user

gs_deluser

Delete an administrator user

gs_passwd

Change the password of administrator user

Change the password as shown below when using a default user. The password is encrypted during registration.

$ gs_passwd admin
Password: (enter password)
Retype password: (re-enter password)

When adding a new administrator user except a default user, the user name has to start with gs#.

One or more ASCII alphanumeric characters and the underscore sign “_” can be used after gs#.

An example on adding a new administrator user is shown below.

$ gs_adduser gs#newuser
Password: (enter password)
Retype password: (re-enter password)

**\[Points to note\]**

*   A GridDB administrator user is different from the OS user gsadm created during installation.
*   A change in the administrator user information using a user administration command becomes valid when a node is restarted.
*   In order to use it for authentication purposes in the client, the same user data needs to be registered in all the nodes. Copy the **user definition file** and make sure the same user data can be referred to in all the nodes.
*   Execute the operating command as a gsadm user.

**\[Memo\]**

*   See “GridDB Operational Management Guide” ([GridDB_OperationGuide.html](https://griddb.net/en/docs/manuals/v3.1/GridDB_OperationGuide.html)) for details of the user management commands.

#### Setting the environment-dependent parameters

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

#### Network environment settings (essential)

First, set up the network environment.

An explanation of the recommended configuration method in an environment that allows a multicast to be used is given below. In an environment which does not allow a multicast to be used, or an environment in which communications between fellow nodes cannot be established in a multicast, a cluster configuration method other than the multicast method has to be used. See [Other cluster configuration method settings](#other_mode) for the details.

The configuration items can be broadly divided as follows.

*   (1) Address information serving as an interface with the client
*   (2) Address information for cluster administration and processing
*   (3) Address information serving as an interface with the JDBC client (GridDB Advanced Edition only)

Although these settings need to be set to match the environment, basically default settings will also work.

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

A multi-cast address and port are specified in the interface address between a client and cluster. This is used by a GridDB cluster to send cluster information to its clients and for the clients to send processing requests via the API to the cluster. See the description of GridStoreFactory class/method in “GridDB API reference” ([GridDB\_API\_Reference.html](http://www.griddb.org/griddb_nosql/manual/GridDB_API_Reference.html)) for details.

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

#### Cluster name settings (essential)

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

#### Settings of other cluster configuration methods

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

\[Memo\]

*   Specify the serviceAddress and servicePort of the node definition file in each module (cluster,sync etc.) for each address and port.
*   sql items are required in the GridDB Advanced Edition only.
*   Set either the /cluster/notificationAddress, /cluster/notificationMember, /cluster/notificationProvider in the cluster definition file to match the cluster configuration method used.
*   See “GridDB technical reference” ([GridDB_TechnicalReference.html](https://griddb.net/en/docs/manuals/v3.1/GridDB_TechnicalReference.html)) for details on the cluster configuration method.

#### Installation and setup (client)

This chapter explains the installation procedure of the client library. There are 2 types of client library in GridDB, Java and C. Only the Java version supports the GridDB Advanced Edition NewSQL interface.

**\[Points to note\]**

*   When choosing the OS package group during OS installation, please choose the minimum version or lower.
    *   Software Development WorkStation

The following needs to be installed as a Java language development environment.

*   Oracle Java 6/7/8
*   Only 64-bit Java is supported by the GridDB Advanced Edition NewSQL interface.

$ java -version
java version "1.7.0_79"
Java(TM) SE Runtime Environment (build 1.7.0_79-b15)
Java HotSpot(TM) 64-Bit Server VM (build 24.79-b02, mixed mode)

#### Installing the client library

The following 4 RPM packages are required for the installation of the GridDB client library. Place the packages anywhere in the machine.

The griddb-newsql package is only available in GridDB Advanced Edition.

  

Package name

File name

Description

griddb-java_lib

griddb-java\_lib-X.X.X-linux.x86\_64.rpm

Java library is included.

(/usr/share/java/gridstore.jar)

griddb-c_lib

griddb-c\_lib-X.X.X-linux.x86\_64.rpm

C header file and library are included.

(/usr/include/gridstore.h and /usr/lib64/libgridstore.so)

griddb-docs

griddb-docs-X.X.X-linux.x86_64.rpm

GridDB manual and program samples are included.

griddb-newsql

griddb-newsql-X.X.X-linux.x86_64.rpm

NewSQL interface library is included.

Install using the rpm command as a root user.

$ su
\# rpm -ivh griddb-c\_lib-X.X.X-linux.x86\_64.rpm
Under preparation...           ########################################### \[100%\]
   1:griddb-c_lib                  ########################################### \[100%\]
\# rpm -ivh griddb-java\_lib-X.X.X-linux.x86\_64.rpm
Under preparation...           ########################################### \[100%\]
   1:griddb-java_lib               ########################################### \[100%\]
\# rpm -ivh griddb-docs-X.X.X-linux.x86_64.rpm
Under preparation...           ########################################### \[100%\]
   1:griddb-docs                   ########################################### \[100%\]
\# rpm -ivh griddb-newsql-X.X.X-linux.x86_64.rpm
Under preparation...           ########################################### \[100%\]
   1:griddb-newsql                 ########################################### \[100%\]

#### Setting up a library

When the Java version of the client is used, add the client library to CLASSPATH.

$ export CLASSPATH=${CLASSPATH}:/usr/share/java/gridstore.jar

When the C version is used instead, add the client library to LD\_LIBRARY\_PATH.

$ export LD\_LIBRARY\_PATH=${LD\_LIBRARY\_PATH}:/usr/lib64
