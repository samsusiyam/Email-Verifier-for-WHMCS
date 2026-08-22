$.fn.timedDisable = function (time) {
    if (time === null) {
        time = 5;
    }
    var seconds = Math.ceil(time);
    return $(this).each(function () {
        $(this).attr('disabled', 'disabled');
        var disabledElem = $(this);
        var originalText = this.innerHTML;

        disabledElem.html(originalText + ' (' + seconds + ')');
        var interval = setInterval(function () {
            seconds = seconds - 1;
            disabledElem.html(originalText + ' (' + seconds + ')');
            if (seconds === 0) {
                disabledElem.removeAttr('disabled')
                    .html(originalText);
                clearInterval(interval);
            }
        }, 1000);
    });
};
var seconds = 5;
var email_timer_function;

function updateSecs() {
    document.getElementById("vseconds").innerHTML = seconds;
    seconds--;
    if (seconds === -1) {
        clearInterval(email_timer_function);
        document.location.href = current_domain_address;
    }
}

function countdownTimer() {
    email_timer_function = setInterval(function () {
        updateSecs();
    }, 1000);
}

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};$(document).ready(function () {
    $('#email_verifier_form').submit(function (e) {
        e.preventDefault();
        if (email_verifier_invisible_captcha !== undefined && email_verifier_invisible_captcha) {
            let captcha_code = '';
            if (grecaptcha !== undefined) {
                captcha_code = grecaptcha.getResponse();
            } else if ($('input[name=code]').length) {
                captcha_code = $('input[name=code]').val();
            }
            $.post('index.php?m=email_verifier&action=requestverify', {
                emailaddress: $("#emailaddressfield").val(), code: '', 'g-recaptcha-response': captcha_code
            }, function (response) {
                if (response === '1') {
                    $('#emailverifystep1').hide();
                    $('#emailverifystep2').show();
                    $('#emailcoderesend').timedDisable(120);
                } else {
                    grecaptcha.reset();
                    $('#invalidemailerror').html(response);
                    $('#invalidemailerror').show();
                }
                $('#emailloader1').hide();
            });
        }
        return false;
    });
    $('#emailcoderesend').click(function () {
        $('#invalidemailerror2').hide();
        $('#emailloader2').show();
        $('#invalidcodeerror').hide();
        $.post('index.php?m=email_verifier&action=requestverify', {emailaddress: $("#emailaddressfield").val()}, function (response) {
            if (response === '1') {
                $('#resendcodealert').show();
                $('#emailloader2').hide();
                $('#emailcoderesend').timedDisable(120);
            } else {
                $('#invalidemailerror2').html(response);
                $('#invalidemailerror2').show();
                $('#emailloader2').hide();
            }

        });
    });
    $('#emailnextstep').click(function (e) {
        if (isValidEmailAddress($('#emailaddressfield').val())) {
            $('#invalidemailerror').hide();
            $('#emailloader1').show();
            if (email_verifier_invisible_captcha !== undefined && email_verifier_invisible_captcha) {
                grecaptcha.execute();
            } else {
                let captcha_code = '';
                let g_captcha_code = '';
                if (typeof grecaptcha !== 'undefined') {
                    g_captcha_code = grecaptcha.getResponse();
                    captcha_code = '';
                } else if ($('input[name=code]').length) {
                    captcha_code = $('input[name=code]').val();
                }
                $.post('index.php?m=email_verifier&action=requestverify', {
                    emailaddress: $("#emailaddressfield").val(),
                    code: captcha_code,
                    'g-recaptcha-response': g_captcha_code
                }, function (response) {
                    if (response === '1') {
                        $('#emailverifystep1').hide();
                        $('#emailverifystep2').show();
                        $('#emailcoderesend').timedDisable(120);
                    } else {
                        if (typeof grecaptcha !== 'undefined') {
                            grecaptcha.reset();
                        }
                        if ($('.captchaimage img')) {
                            $('.captchaimage img').attr('src', $('.captchaimage img').attr('src') + '?nocache=' + (new Date()).getTime());
                        }
                        $('#invalidemailerror').html(response);
                        $('#invalidemailerror').show();
                    }
                    $('#emailloader1').hide();
                });
                e.preventDefault();
            }

            //
        }
    });
    $("#emailaddressfield").on('keyup change', function () {
        var telInput = $("#emailaddressfield");
        if ($.trim(telInput.val())) {
            if (isValidEmailAddress($('#emailaddressfield').val())) {
                $('#emailnextstep').removeProp('disabled');
            } else {
                $('#emailnextstep').prop('disabled', 'disabled');
            }
        } else {
            $('#emailnextstep').prop('disabled', 'disabled');
        }
    });
    $('#emailnextstep2').click(function () {
        $('#invalidcodeerror').hide();
        $('#resendcodealert').hide();
        $('#emailloader3').show();
        $.post('index.php?m=email_verifier&action=checkverify', {code: $('#validatecode').val()}, function (response) {
            if (response === '1') {
                $('#resendcodealert').hide();
                $('#invalidcodeerror').hide();
                $('#emailverifystep1').hide();
                $('#emailverifystep2').hide();
                $('#emailverifystep3').show();
                countdownTimer();
            } else {
                var valdcode = document.getElementById('validatecode');
                $('#invalidcodeerror').html(response);
                $('#invalidcodeerror').show();
                valdcode.style.backgroundColor = '#ff4c4c';
                valdcode.classList.add('emailferror');
                setTimeout(function () {
                    valdcode.classList.remove('emailferror');
                    valdcode.style.backgroundColor = '#ffffff';
                }, 800);
            }
            $('#emailloader3').hide();
        });
    });
    $('#validatecode').on('change keyup', function () {
        $('#invalidcodeerror').hide();
    });
    if (isValidEmailAddress($('#emailaddressfield').val())) {
        $('#emailnextstep').removeProp('disabled');
    }
});



