+++
title = "Upgrading Editions"
weight = 4
+++


Follow the procedure below to update the software.

*   Stop the cluster
*   Stop the node
*   Make a backup copy of the definition file, database file and event log file
*   Update the software
*   Start the node
*   Configure the cluster

An example of the command execution in a machine in which the nodes have been started is shown below.

\[Command execution example\]

$ gs_stopcluster -u admin/admin
$ gs_stopnode -u admin/admin
$ cp -rp /var/lib/gridstore/data /xxx/shelter  # copy just in case
$ cp -rp /var/lib/gridstore/log /xxx/shelter   # copy just in case
$ cp -rp /var/lib/gridstore/conf /xxx/shelter  # copy just in case
$ su
\# rpm -Uvh griddb-server-Y.Y.Y-linux.x86_64.rpm
\# rpm -Uvh griddb-client-Y.Y.Y-linux.x86_64.rpm
\# rpm -Uvh griddb-docs-Y.Y.Y-linux.x86_64.rpm
\# exit
$ gs_startnode
$ gs_joincluster -c configured cluster name -u admin/admin

*Y.Y.Y: Version of GridDB to update
