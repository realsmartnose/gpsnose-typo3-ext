# customsubcategory=resources=LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:customsubcategory.resources
# customsubcategory=javascript=LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:customsubcategory.javascript
# customsubcategory=css=LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:customsubcategory.css
# customsubcategory=login=LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:customsubcategory.login

plugin.tx_gpsnose {

  resources {
    # cat=plugin.tx_gpsnose/resources/010; type=string; label=Path to images
    imagePath = EXT:gpsnose/Resources/Public/Mashup/Images/
  }

  css {
    # cat=plugin.tx_gpsnose/css/010; type=string; label=Location to CSS
    frontendCss = EXT:gpsnose/Resources/Public/Mashup/Css/style.min.css
  }

  javascript {
    # cat=plugin.tx_gpsnose/javascript/010; type=string; label=Location of jQuery
    jquery = EXT:gpsnose/Resources/Public/Mashup/Libs/jquery/3.3.1/jquery.min.js

    # cat=plugin.tx_gpsnose/javascript/020; type=string; label=Location of BigNumber
    bignumber = EXT:gpsnose/Resources/Public/Mashup/Libs/bignumber-rev4/js/bignumber.min.js

    # cat=plugin.tx_gpsnose/javascript/030; type=string; label=Location of moment
    moment = EXT:gpsnose/Resources/Public/Mashup/Libs/moment/2.17.1/moment.min.js

    # cat=plugin.tx_gpsnose/javascript/040; type=string; label=Location of numeral-js
    numeral = EXT:gpsnose/Resources/Public/Mashup/Libs/Numeral-js/2.0.6/numeral.min.js

    # cat=plugin.tx_gpsnose/javascript/050; type=string; label=Location of imagesloaded.js
    imagesloaded = EXT:gpsnose/Resources/Public/Mashup/Libs/imagesloaded/4.1.4/imagesloaded.pkgd.min.js

    # cat=plugin.tx_gpsnose/javascript/060; type=string; label=Location of masonry.js
    masonry = EXT:gpsnose/Resources/Public/Mashup/Libs/masonry/4.2.1/masonry.pkgd.min.js

    # cat=plugin.tx_gpsnose/javascript/070; type=string; label=Location of Knockout.js
    knockout = EXT:gpsnose/Resources/Public/Mashup/Libs/knockout/3.4.2/knockout.js

    # cat=plugin.tx_gpsnose/javascript/080; type=string; label=Location of Knockout ViewModel
    knockoutVm = EXT:gpsnose/Resources/Public/Mashup/Js/gpsnose.knockout.min.js

    # cat=plugin.tx_gpsnose/javascript/090; type=string; label=Location of maframework
    maframework = EXT:gpsnose/Resources/Public/Mashup/Js/maframework.min.js
  }

  login {
    # cat=plugin.tx_gpsnose/login/010; type=int; label=Login page-ID
    loginPid =

    # cat=plugin.tx_gpsnose/login/020; type=int; label=Usergroup for GpsNose-Users
    groupId =

    # cat=plugin.tx_gpsnose/login/030; type=string; label=Loginname prefix for GpsNose-Users
    loginNamePrefix = #

    # cat=plugin.tx_gpsnose/login/040; type=string; label=Mashup-Community used for login from App
    loginMashup = 
  }

  view {
    # cat=plugin.tx_gpsnose/file/010; type=string; label=Path to template root (FE)
    templateRootPath = EXT:gpsnose/Resources/Private/Templates/

    # cat=plugin.tx_gpsnose/file/020; type=string; label=Path to template partials (FE)
    partialRootPath = EXT:gpsnose/Resources/Private/Partials/

    # cat=plugin.tx_gpsnose/file/030; type=string; label=Path to template layouts (FE)
    layoutRootPath = EXT:gpsnose/Resources/Private/Layouts/
  }

  persistence {
    # cat=plugin.tx_gpsnose//a; type=string; label=Default storage PID
    storagePid =
  }
}


module.tx_gpsnose_gnadmin {
  view {
    # cat=module.tx_gpsnose_gnadmin/file/010; type=string; label=Path to template root (BE)
    templateRootPath = EXT:gpsnose/Resources/Private/Backend/Templates/

    # cat=module.tx_gpsnose_gnadmin/file/020; type=string; label=Path to template partials (BE)
    partialRootPath = EXT:gpsnose/Resources/Private/Backend/Partials/

    # cat=module.tx_gpsnose_gnadmin/file/030; type=string; label=Path to template layouts (BE)
    layoutRootPath = EXT:gpsnose/Resources/Private/Backend/Layouts/
  }
}
