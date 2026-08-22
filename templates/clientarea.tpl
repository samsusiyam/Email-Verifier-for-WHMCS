<style>
    .glyphicon.spinning {
        animation: spin 1s infinite linear;
        -webkit-animation: spin2 1s infinite linear;
    }

    @keyframes spin {
        from {
            transform: scale(1) rotate(0deg);
        }
        to {
            transform: scale(1) rotate(360deg);
        }
    }

    @-webkit-keyframes spin2 {
        from {
            -webkit-transform: rotate(0deg);
        }
        to {
            -webkit-transform: rotate(360deg);
        }
    }

    .emailferror {
        position: relative;
        animation: shake .1s linear;
        animation-iteration-count: 3;
    }

    @keyframes shake {
        0% {
            left: -5px;
        }
        100% {
            right: -5px;
        }
    }

    #emailaddressfield {
        max-width: 50%;
        display: inline;
    }

    #validatecode {
        max-width: 200px;
        display: inline;
    }

    .captcha-email-verifier p {
        display: none;
    }
</style>
{$email_verifier_header}
<form action="" id="email_verifier_form">
    <div class="row">
        <div class="col-md-12">
            <div class="panel card card-info panel-info">
                <div class="panel-heading card-header">
                    <div class="panel-title">{$addon_lang['epagetitle']}</div>
                </div>
                <div class="panel-body card-body">
                    <div id="emailverifystep1" style="display: block">
                        <div class="clearfix"></div>
                        <div class="form-group">
                            <div class="alert alert-danger" id="invalidemailerror" style="display: none"></div>
                        </div>
                        <div class="form-group text-center">
                            <label for="emailaddressfield" class="control-label requiredField"
                                   style=""> {$addon_lang['emailaddress']} </label>
                            <input class="form-control" id="emailaddressfield" value="{$client_email}"
                                   name="emailaddress" type="email" required="" {if $islogged}readonly=""{/if}/>
                        </div>
                        {if $addon_settings['captcha'] == '1'}
                            <div class="form-group captcha-email-verifier">
                                {include file="modules/addons/email_verifier/templates/captcha.tpl"}
                            </div>
                        {/if}
                        <div class="form-group">
                            <div class="col-md-12 text-center ">
                                <button type="button" disabled=""
                                        class="btn btn-primary btn btn-info {$captcha->getButtonClass('email_verifier')}"
                                        id="emailnextstep">
                            <span id="emailloader1" style="display: none"
                                  class="glyphicon glyphicon-refresh spinning"></span> {$addon_lang['estartverify']}
                                </button>
                                {if !$islogged}
                                    <a class="btn btn-warning btn btn-info"
                                       href="index.php?m=email_verifier&action=verify&login=1">
                                        {$addon_lang['eloginclient']}</a>
                                {/if}
                            </div>
                        </div>
                    </div>
                    <div id="emailverifystep2" style="display: none">
                        <div class="clearfix"></div>
                        <div class="form-group">
                            <div class="alert alert-danger" id="invalidemailerror2" style="display: none"></div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="form-group">
                            <div class="alert alert-danger" id="invalidcodeerror"
                                 style="display: none">{$addon_lang['invalid_code']}</div>
                        </div>
                        <div class="form-group">
                            <div class="alert alert-success" id="resendcodealert"
                                 style="display: none">{$addon_lang['enewcodemessage']}</div>
                        </div>

                        <div class="form-group">
                            <div class="alert alert-success" style="color: green;margin-bottom: 40px;">
                                <small>{$addon_lang['etext']}</small></div>
                        </div>
                        <div class="form-group text-center" style="margin-top: 25px;margin-bottom: 45px;">
                            <label for="validatecode"
                                   class="control-label  requiredField"> {$addon_lang['eentercode']} </label>
                            <input class="form-control" id="validatecode" autocomplete="off" name="validatecode"
                                   type="text"/><br>
                        </div>
                        <div class="form-group text-center">
                            <div class="col-md-12 ">
                                <button type="button" class="btn btn-primary btn btn-success" id="emailnextstep2">
                            <span id="emailloader3" style="display: none"
                                  class="glyphicon glyphicon-refresh spinning"></span> {$addon_lang['evalidatecode']}
                                </button>
                                <button type="button" disabled="" class="btn btn-primary btn btn-warning"
                                        id="emailcoderesend">
                            <span id="emailloader2" style="display: none"
                                  class="glyphicon glyphicon-refresh spinning"></span> {$addon_lang['eresendbutton']}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="emailverifystep3" style="display: none">
                        <div class="clearfix"></div>
                        <div class="form-group">
                            {if $backcart}
                                <div class="alert alert-success">{$addon_lang['everfiedmessage']}
                                    <br><small><a
                                                href="{$systemurl|rtrim:"/"}/cart.php?a=checkout"> {$addon_lang['eredirectcartmessage']}
                                            <span id="vseconds">5</span></small><br></a></div>
                            {elseif $register_page}
                                <div class="alert alert-success">{$addon_lang['everfiedmessage']}
                                    <br><small><a
                                                href="{$systemurl|rtrim:"/"}/register.php"> {$addon_lang['eredirectregistermessage']}
                                            <span id="vseconds">5</span></small><br></a></div>
                            {else}
                                <div class="alert alert-success">{$addon_lang['everfiedmessage']}
                                    <br><small> <a
                                                href="{$systemurl|rtrim:"/"}/clientarea.php">{$addon_lang['eredirectmessage']}
                                            <span id="vseconds">5</span></small><br></a></div>
                            {/if}
                        </div>
                    </div>
                </div>
                {if $loggedin && $addon_lang['info_existing_client']}
                    <div class="panel-footer card-footer">
                        <small>{$addon_lang['info_existing_client']}</small>
                    </div>
                {elseif $addon_lang['info_order']}
                    <div class="panel-footer card-footer">
                        <small>{$addon_lang['info_order']}</small>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</form>
<script>
    {if $backcart}
    var current_domain_address = '{$systemurl|rtrim:"/"}/cart.php?a=checkout';
    {elseif $register_page}
    var current_domain_address = '{$systemurl|rtrim:"/"}/register.php';
    {else}
    var current_domain_address = '{$systemurl|rtrim:"/"}/clientarea.php';
    {/if}
</script>
<script>
    var email_verifier_invisible_captcha = {if $captcha && $captcha == 'invisible'}true{else}false{/if};
</script>
<script src="{$systemurl|rtrim:"/"}/modules/addons/email_verifier/assets/js/scripts.js"></script>

{$email_verifier_footer}