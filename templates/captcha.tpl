{if $captcha->isEnabled() && $captcha->isEnabledForForm($captchaForm)}
    <div class="text-center{if $containerClass}{$containerClass}{else} row justify-content-center{/if}">
        {if $templatefile == 'homepage'}
        <div class="domainchecker-homepage-captcha">
            {/if}

            {if $captcha == "recaptcha"}
                <div id="google-recaptcha-domainchecker" class="form-group recaptcha-container mx-auto"></div>
            {elseif !in_array($captcha, ['invisible', 'recaptcha'])}
                <div class="col-md-12 mx-auto mb-3 mb-sm-0">
                    <div id="default-captcha-domainchecker"
                         class="text-center row pb-3">
                        <p>{lang key="captchaverify"}</p>

                        <div class="col-6 col-xs-6 captchaimage">
                            <img id="inputCaptchaImage" data-src="{$systemurl}includes/verifyimage.php"
                                 src="{$systemurl}includes/verifyimage.php" align="middle"/>
                        </div>

                        <div class="col-6 col-xs-6">
                            <input id="inputCaptcha" type="text" name="code" maxlength="6"
                                   class="form-control"
                                   data-toggle="tooltip" data-placement="right" data-trigger="manual"
                                   title="{lang key='orderForm.required'}"/>
                        </div>
                    </div>
                </div>
            {/if}

            {if $templatefile == 'homepage'}
        </div>
        {/if}
    </div>
{/if}
