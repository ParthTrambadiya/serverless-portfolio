$(document).ready(function() {
    var form = $('#contactForm');

    $.validator.addMethod('letterOnly', function (value, element){
        var letterOnly = /^[a-zA-Z ]*$/;
        if(letterOnly.test(value)){
            return true;
        }
    }, 'Your name must be in letters only.');

    $.validator.addMethod('emailValidate', function (value, element){
        var email = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if(email.test(value)){
            return true;
        }
    }, 'Your email address must be in the format of name@domain.com.');

    form.validate({
        rules: {
            fullname: {
                required: true,
                letterOnly: true
            },
            email: {
                required: true,
                emailValidate: true
            },
            subject: {
                required: true
            },
            message: {
                required: true
            }
        },
        messages: {
            fullname: {
                required: 'I need your good name for communication.'
            },
            email: {
                required: 'I need your email address to contact you.'
            },
            subject: {
                required: 'Please specify your suject.'
            },
            message: {
                required: 'Please write a message for me.'
            }
        }
    });

    function toTitleCase(str) {
        return str.replace(/(?:^|\s)\w/g, function(match) {
            return match.toUpperCase();
        });
    }

    form.submit(function(e) {
        e.preventDefault();

        if(form.valid()) {
            var fullname = toTitleCase($('#contactForm #fullname').val().trim());
            var email = $('#contactForm #email').val().trim().toLowerCase();
            var subject = $('#contactForm #subject').val().trim();
            var message = $('#contactForm #message').val().trim();
            var firstname = fullname;

            if(firstname.indexOf(' ') >= 0) {
                firstname = firstname.split(" ").slice(0, -1).join(" ");
            }

            $this = $('#contactForm #send-msg-btn');

            $.ajax({
                url: '/dev/contact',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    id: Date.now().toString(),
                    fullname: fullname,
                    email: email,
                    subject: subject,
                    message: message
                }),
                cache: false,
                success: function() {
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success')
                        .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<img src='./assets/img/MenuIcons/sent.svg' class='mr-2' style='max-width: 25px;'>")
                    $('#success > .alert-success')
                        .append("<strong>Your message has been sent.</strong>");
                    $('#success > .alert-success').append("</div>")

                    $('#contactForm').trigger("reset");
                },
                error: function() {
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger')
                        .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<img src='./assets/img/MenuIcons/delete.svg' class='mr-2' style='max-width: 25px;'>")
                    $('#success > .alert-danger')
                        .append("<strong> Sorry " + firstname + ", it seems that my mail server is not responding. Please try again later!");
                    $('#success > .alert-danger').append("</div>")

                    $('#contactForm').trigger("reset");
                },
                complete: function() {
                    setTimeout(function() {
                        $this.prop('disabled', false);
                    }, 1000);
                }
            });
        } 
    });
});