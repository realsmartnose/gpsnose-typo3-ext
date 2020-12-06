#
# Table structure for table 'tx_gpsnose_domain_model_mashup'
#
CREATE TABLE tx_gpsnose_domain_model_mashup (

    community_tag varchar(255) DEFAULT '' NOT NULL,
    validation_key varchar(255) DEFAULT '' NOT NULL,
    app_key varchar(255) DEFAULT '' NOT NULL,
    validation_ticks varchar(20) DEFAULT '0' NOT NULL,
    max_calls_daily int(11) DEFAULT '0' NOT NULL,
    max_calls_monthly int(11) DEFAULT '0' NOT NULL,
    max_sub_sites int(11) DEFAULT '0' NOT NULL,
    max_hosts int(11) DEFAULT '0' NOT NULL,
    mashup_token_callback_url text DEFAULT '' NOT NULL,
    sub_communities int(11) unsigned DEFAULT '0' NOT NULL,
    hosts int(11) unsigned DEFAULT '0' NOT NULL,
    call_history int(11) unsigned DEFAULT '0' NOT NULL,
    exceeded_quota_history int(11) unsigned DEFAULT '0' NOT NULL,
    tokens int(11) unsigned DEFAULT '0' NOT NULL,

    tstamp int(11) unsigned DEFAULT '0' NOT NULL,
    crdate int(11) unsigned DEFAULT '0' NOT NULL,
    cruser_id int(11) unsigned DEFAULT '0' NOT NULL,
    deleted tinyint(4) unsigned DEFAULT '0' NOT NULL,
    hidden tinyint(4) unsigned DEFAULT '0' NOT NULL,
    starttime int(11) unsigned DEFAULT '0' NOT NULL,
    endtime int(11) unsigned DEFAULT '0' NOT NULL,

);

#
# Table structure for table 'tx_gpsnose_domain_model_subcommunity'
#
CREATE TABLE tx_gpsnose_domain_model_subcommunity (

    mashup int(11) unsigned DEFAULT '0' NOT NULL,

    name varchar(255) DEFAULT '' NOT NULL,

    tstamp int(11) unsigned DEFAULT '0' NOT NULL,
    crdate int(11) unsigned DEFAULT '0' NOT NULL,
    cruser_id int(11) unsigned DEFAULT '0' NOT NULL,
    deleted tinyint(4) unsigned DEFAULT '0' NOT NULL,
    hidden tinyint(4) unsigned DEFAULT '0' NOT NULL,
    starttime int(11) unsigned DEFAULT '0' NOT NULL,
    endtime int(11) unsigned DEFAULT '0' NOT NULL,

);

#
# Table structure for table 'tx_gpsnose_domain_model_host'
#
CREATE TABLE tx_gpsnose_domain_model_host (

    mashup int(11) unsigned DEFAULT '0' NOT NULL,

    domain varchar(255) DEFAULT '' NOT NULL,

    tstamp int(11) unsigned DEFAULT '0' NOT NULL,
    crdate int(11) unsigned DEFAULT '0' NOT NULL,
    cruser_id int(11) unsigned DEFAULT '0' NOT NULL,
    deleted tinyint(4) unsigned DEFAULT '0' NOT NULL,
    hidden tinyint(4) unsigned DEFAULT '0' NOT NULL,
    starttime int(11) unsigned DEFAULT '0' NOT NULL,
    endtime int(11) unsigned DEFAULT '0' NOT NULL,

);

#
# Table structure for table 'tx_gpsnose_domain_model_history'
#
CREATE TABLE tx_gpsnose_domain_model_history (

    mashup int(11) unsigned DEFAULT '0' NOT NULL,
    mashup3 int(11) unsigned DEFAULT '0' NOT NULL,

    ticks varchar(20) DEFAULT '0' NOT NULL,
    count int(11) DEFAULT '0' NOT NULL,

    tstamp int(11) unsigned DEFAULT '0' NOT NULL,
    crdate int(11) unsigned DEFAULT '0' NOT NULL,
    cruser_id int(11) unsigned DEFAULT '0' NOT NULL,
    deleted tinyint(4) unsigned DEFAULT '0' NOT NULL,
    hidden tinyint(4) unsigned DEFAULT '0' NOT NULL,
    starttime int(11) unsigned DEFAULT '0' NOT NULL,
    endtime int(11) unsigned DEFAULT '0' NOT NULL,

    t3ver_oid int(11) DEFAULT '0' NOT NULL,
    t3ver_id int(11) DEFAULT '0' NOT NULL,
    t3ver_wsid int(11) DEFAULT '0' NOT NULL,
    t3ver_label varchar(255) DEFAULT '' NOT NULL,
    t3ver_state tinyint(4) DEFAULT '0' NOT NULL,
    t3ver_stage int(11) DEFAULT '0' NOT NULL,
    t3ver_count int(11) DEFAULT '0' NOT NULL,
    t3ver_tstamp int(11) DEFAULT '0' NOT NULL,
    t3ver_move_id int(11) DEFAULT '0' NOT NULL,

);

#
# Table structure for table 'tx_gpsnose_domain_model_token'
#
CREATE TABLE tx_gpsnose_domain_model_token (

    mashup int(11) unsigned DEFAULT '0' NOT NULL,

    payload text DEFAULT '' NOT NULL,
    options int(11) unsigned DEFAULT '0' NOT NULL,
    value_per_unit decimal(11,3) DEFAULT '0.0',
    label text DEFAULT '' NOT NULL,
    valid_until_ticks varchar(20) DEFAULT '0' NOT NULL,
    creation_ticks varchar(20) DEFAULT '0' NOT NULL,
    created_by_login_name text DEFAULT '' NOT NULL,
    callback_response text DEFAULT '' NOT NULL,
    token_scans int(11) unsigned DEFAULT '0' NOT NULL,

    tstamp int(11) unsigned DEFAULT '0' NOT NULL,
    crdate int(11) unsigned DEFAULT '0' NOT NULL,
    cruser_id int(11) unsigned DEFAULT '0' NOT NULL,
    deleted tinyint(4) unsigned DEFAULT '0' NOT NULL,
    hidden tinyint(4) unsigned DEFAULT '0' NOT NULL,
    starttime int(11) unsigned DEFAULT '0' NOT NULL,
    endtime int(11) unsigned DEFAULT '0' NOT NULL,

    t3ver_oid int(11) DEFAULT '0' NOT NULL,
    t3ver_id int(11) DEFAULT '0' NOT NULL,
    t3ver_wsid int(11) DEFAULT '0' NOT NULL,
    t3ver_label varchar(255) DEFAULT '' NOT NULL,
    t3ver_state tinyint(4) DEFAULT '0' NOT NULL,
    t3ver_stage int(11) DEFAULT '0' NOT NULL,
    t3ver_count int(11) DEFAULT '0' NOT NULL,
    t3ver_tstamp int(11) DEFAULT '0' NOT NULL,
    t3ver_move_id int(11) DEFAULT '0' NOT NULL,

);

#
# Table structure for table 'tx_gpsnose_domain_model_tokenscan'
#
CREATE TABLE tx_gpsnose_domain_model_tokenscan (

    token int(11) unsigned DEFAULT '0' NOT NULL,

    scanned_by_login_name varchar(255) DEFAULT '' NOT NULL,
    scanned_ticks varchar(20) DEFAULT '0' NOT NULL,
    recorded_ticks varchar(20) DEFAULT '0' NOT NULL,
    scanned_latitude decimal(18,12) DEFAULT '0.0' NOT NULL,
    scanned_longitude decimal(18,12) DEFAULT '0.0' NOT NULL,
    callback_response_http_code int(11) DEFAULT '0' NOT NULL,
    callback_response_message text DEFAULT '' NOT NULL,
    is_batch_completed tinyint(4) unsigned DEFAULT '0' NOT NULL,
    amount int(11) DEFAULT '0' NOT NULL,
    comment text DEFAULT '' NOT NULL,
    is_gps_sharing_wanted tinyint(4) unsigned DEFAULT '0' NOT NULL,
    value_per_unit decimal(11,3) DEFAULT '0.0',
    label text DEFAULT '',
    valid_until_ticks varchar(20) DEFAULT '0' NOT NULL,
    creation_ticks varchar(20) DEFAULT '0' NOT NULL,
    created_by_login_name varchar(20) DEFAULT '' NOT NULL,
    batch_creation_ticks varchar(20) DEFAULT '0' NOT NULL,

);


#
# Modifying tt_content table
#
CREATE TABLE tt_content (
    tx_gpsnose_community_tag varchar(255) DEFAULT '' NOT NULL,
    tx_gpsnose_mashup_login_acl int(11) DEFAULT '0' NOT NULL,
    tx_gpsnose_mashup_login_option_must_join tinyint(4) unsigned DEFAULT '0' NOT NULL,
    tx_gpsnose_mashup_login_option_needs_activation tinyint(4) unsigned DEFAULT '0' NOT NULL,
    tx_gpsnose_mashup_login_redirect varchar(11) DEFAULT '' NOT NULL,
);


#
# Modifying fe_users table
#
CREATE TABLE fe_users (
    gpsnose_loginname varchar(255) DEFAULT '' NOT NULL,
    gpsnose_is_activated tinyint(4) unsigned DEFAULT NULL,
    gpsnose_fullname varchar(255) DEFAULT NULL,
    gpsnose_communities text,
    gpsnose_is_safe_mode tinyint(4) unsigned DEFAULT NULL,
    gpsnose_latitude double(11,4) DEFAULT '0.0',
    gpsnose_longitude double(11,4) DEFAULT '0.0',
);
