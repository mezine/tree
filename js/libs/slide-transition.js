SlideTransition = {
  componentWillEnter: function (done) {
    var $this = $(this.getDOMNode());
    $this.css('display', 'none');
    $this.slideDown(100, done);
  },
  componentWillLeave: function (done) {
    var $this = $(this.getDOMNode());
    $this.slideUp(100, done);
  }
};

module.exports = SlideTransition;