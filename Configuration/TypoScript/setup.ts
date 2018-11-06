# plugin configuration
plugin.tx_gpsnose {
  settings {

    resources {
      imagePath = {$plugin.tx_gpsnose.resources.imagePath}
    }

    css {
      frontendCss = {$plugin.tx_gpsnose.css.frontendCss}
    }

    javascript {
      jquery = {$plugin.tx_gpsnose.javascript.jquery}
      bignumber = {$plugin.tx_gpsnose.javascript.bignumber}
      moment = {$plugin.tx_gpsnose.javascript.moment}
      numeral = {$plugin.tx_gpsnose.javascript.numeral}
      imagesloaded = {$plugin.tx_gpsnose.javascript.imagesloaded}
      masonry = {$plugin.tx_gpsnose.javascript.masonry}
      knockout = {$plugin.tx_gpsnose.javascript.knockout}
      knockoutVm = {$plugin.tx_gpsnose.javascript.knockoutVm}
      maframework = {$plugin.tx_gpsnose.javascript.maframework}
    }

    login {
      loginPid = {$plugin.tx_gpsnose.login.loginPid}
      groupId = {$plugin.tx_gpsnose.login.groupId}
      loginNamePrefix = {$plugin.tx_gpsnose.login.loginNamePrefix}
      loginMashup = {$plugin.tx_gpsnose.login.loginMashup}
    }

    # max 20
    membersPageSize = 12

    # max 20
    newsPageSize = 12

    # max 20
    commentsPageSize = 12

    # max 100
    nearbyNosesPageSize = 100

    # max 100
    nearbyImpressionsPageSize = 100

    # max 100
    nearbyPoisPageSize = 100

    # max 100
    nearbyTracksPageSize = 100

    # max 100
    nearbyEventsPageSize = 100

    # ajax page types
    ajax {
      pageMembers = 10001
      pageNews = 10002
      pageComments = 10003
      commentSave = 10004
      loginVerifie = 10005
      pageNearbyNoses = 10006
      pageNearbyImpressions = 10007
      pageNearbyPois = 10008
      pageNearbyTracks = 10009
      pageNearbyEvents = 10010
    }
  }
  view {
    templateRootPaths.0 = EXT:gpsnose/Resources/Private/Templates/
    templateRootPaths.1 = {$plugin.tx_gpsnose.view.templateRootPath}
    partialRootPaths.0 = EXT:gpsnose/Resources/Private/Partials/
    partialRootPaths.1 = {$plugin.tx_gpsnose.view.partialRootPath}
    layoutRootPaths.0 = EXT:gpsnose/Resources/Private/Layouts/
    layoutRootPaths.1 = {$plugin.tx_gpsnose.view.layoutRootPath}
  }
  persistence {
    storagePid = {$plugin.tx_gpsnose.persistence.storagePid}
    #recursive = 1
  }
  features {
    #skipDefaultArguments = 1
  }
  mvc {
    #callDefaultActionIfActionCantBeResolved = 1
  }
}


# Extend fe_users
config.tx_extbase {
  persistence.classes {
    SmartNoses\Gpsnose\Domain\Model\FrontendUser {
      mapping {
        tableName = fe_users
      }
    }
  }
}


# Module configuration
module.tx_gpsnose_tools_gpsnosegnadmin {
  persistence {
    storagePid = {$plugin.tx_gpsnose.persistence.storagePid}
  }
  view {
    templateRootPaths.0 = EXT:gpsnose/Resources/Private/Backend/Templates/
    templateRootPaths.1 = {$module.tx_gpsnose_gnadmin.view.templateRootPath}
    partialRootPaths.0 = EXT:gpsnose/Resources/Private/Backend/Partials/
    partialRootPaths.1 = {$module.tx_gpsnose_gnadmin.view.partialRootPath}
    layoutRootPaths.0 = EXT:gpsnose/Resources/Private/Backend/Layouts/
    layoutRootPaths.1 = {$module.tx_gpsnose_gnadmin.view.layoutRootPath}
  }
}


# Meta for validation
lib.gpsnose_validate = CONTENT
lib.gpsnose_validate {
  table = tx_gpsnose_domain_model_mashup
  select {
    pidInList = {$plugin.tx_gpsnose.persistence.storagePid}
    orderBy = uid
    selectFields = uid, community_tag, validation_key
    where = ( app_key = '' AND validation_key != '' AND hidden = '0' AND deleted = '0')
    max = 1
  }
  renderObj = COA
  renderObj {
    1 = TEXT
    1.insertData = 1
    1.data = field:validation_key
    1.wrap = <meta name="gpsnose-validation-key" content="|" />
  }
}
page {
  headerData {
    10100 < lib.gpsnose_validate
  }
  10100 = USER_INT
  10100 {
    userFunc = SmartNoses\Gpsnose\UserFuncs\GnLogin->login
    output = location.href = location.origin;
    output.stdWrap.wrap = <script>|</script>
  }
}

 
# ajax action page-members
ajax_gpsnose_pagemembers = PAGE
ajax_gpsnose_pagemembers {
  typeNum < plugin.tx_gpsnose.settings.ajax.pageMembers
  10 < tt_content.list.20.gpsnose_pagemembers
  config {
    disableAllHeaderCode = 1
    additionalHeaders = Content-type:application/json
    xhtml_cleaning = 0
    admPanel = 0
    debug = 0
    no_cache = 1
  }
}
 
# ajax action page-news
ajax_gpsnose_pagenews < ajax_gpsnose_pagemembers
ajax_gpsnose_pagenews {
  typeNum < plugin.tx_gpsnose.settings.ajax.pageNews
  10 < tt_content.list.20.gpsnose_pagenews
}

# ajax action page-comments
ajax_gpsnose_pagecomments < ajax_gpsnose_pagemembers
ajax_gpsnose_pagecomments {
  typeNum < plugin.tx_gpsnose.settings.ajax.pageComments
  10 < tt_content.list.20.gpsnose_pagecomments
}

# ajax action comment-safe
ajax_gpsnose_commentsave < ajax_gpsnose_pagemembers
ajax_gpsnose_commentsave {
  typeNum < plugin.tx_gpsnose.settings.ajax.commentSave
  10 < tt_content.list.20.gpsnose_commentsave
}

# ajax action verifie
ajax_gpsnose_verifie < ajax_gpsnose_pagemembers
ajax_gpsnose_verifie {
  typeNum < plugin.tx_gpsnose.settings.ajax.loginVerifie
  10 < tt_content.list.20.gpsnose_loginverifie
}

# ajax action page-nearby-noses
ajax_gpsnose_pagenearbynoses < ajax_gpsnose_pagemembers
ajax_gpsnose_pagenearbynoses {
  typeNum < plugin.tx_gpsnose.settings.ajax.pageNearbyNoses
  10 < tt_content.list.20.gpsnose_pagenearbynoses
}

# ajax action page-nearby-impressions
ajax_gpsnose_pagenearbyimpressions < ajax_gpsnose_pagemembers
ajax_gpsnose_pagenearbyimpressions {
  typeNum < plugin.tx_gpsnose.settings.ajax.pageNearbyImpressions
  10 < tt_content.list.20.gpsnose_pagenearbyimpressions
}

# ajax action page-nearby-pois
ajax_gpsnose_pagenearbypois < ajax_gpsnose_pagemembers
ajax_gpsnose_pagenearbypois {
  typeNum < plugin.tx_gpsnose.settings.ajax.pageNearbyPois
  10 < tt_content.list.20.gpsnose_pagenearbypois
}

# ajax action page-nearby-tracks
ajax_gpsnose_pagenearbytracks < ajax_gpsnose_pagemembers
ajax_gpsnose_pagenearbytracks {
  typeNum < plugin.tx_gpsnose.settings.ajax.pageNearbyTracks
  10 < tt_content.list.20.gpsnose_pagenearbytracks
}

# ajax action page-nearby-events
ajax_gpsnose_pagenearbyevents < ajax_gpsnose_pagemembers
ajax_gpsnose_pagenearbyevents {
  typeNum < plugin.tx_gpsnose.settings.ajax.pageNearbyEvents
  10 < tt_content.list.20.gpsnose_pagenearbyevents
}
