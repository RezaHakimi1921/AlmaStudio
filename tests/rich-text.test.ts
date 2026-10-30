import assert from "node:assert/strict";
import { sanitizeBodyHtml as s } from "../src/lib/rich-text";

assert.equal(s("<p>سلام <b>آلما</b></p>"), "<p>سلام <b>آلما</b></p>");
assert.equal(s('<p style="color:red" onclick="x()">a <strong>b</strong></p>'), "<p>a <b>b</b></p>");
assert.equal(s("<div>یک</div><div>دو</div>"), "<p>یک</p><p>دو</p>");
assert.equal(s("<p>x<script>alert(1)</script></p>"), "<p>x</p>");
assert.equal(s('<p><img src=x onerror="alert(1)">y</p>'), "<p>y</p>");
assert.equal(s('<p><a href="javascript:1">لینک</a></p>'), "<p>لینک</p>");
assert.equal(s("خط اول\nخط دوم"), "<p>خط اول</p>\n<p>خط دوم</p>");
assert.equal(s("<p></p><p><br></p><p>z</p>"), "<p>z</p>");
assert.equal(s("<p>a<br/>b</p>"), "<p>a<br>b</p>");
assert.equal(s("<p>۲ < ۳</p>"), "<p>۲ &lt; ۳</p>");
assert.equal(s(""), "");
console.log("rich-text: all assertions passed");
