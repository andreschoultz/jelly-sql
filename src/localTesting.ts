import { lexer } from "./lexer";
import { parser } from "./parser";

/** Html element selectors
 * 
 * - Tag
 * - Id
 * - Attribute
 * - Class
 * - Style
 */

/**HTML Elements
 * 
 *  a, abbr, acronym (Deprecated), address, area, article, aside, audio, b, base, bdi, bdo, big (Deprecated), blockquote, body, br, button, canvas, caption, center (Deprecated), cite, code, col, colgroup, data, datalist, dd, del, details, dfn, dialog, dir (Deprecated), div, dl, dt, em, embed, fencedframe (Experimental), fieldset, figcaption, figure, font (Deprecated), footer, form, frame (Deprecated), frameset (Deprecated), h1, head, header, hgroup, hr, html, i, iframe, img, input, ins, kbd, label, legend, li, link, main, map, mark, marquee (Deprecated), menu, meta, meter, nav, nobr (Deprecated), noembed (Deprecated), noframes (Deprecated), noscript, object, ol, optgroup, option, output, p, param (Deprecated), picture, plaintext (Deprecated), portal (Experimental), pre, progress, q, rb (Deprecated), rp, rt, rtc (Deprecated), ruby, s, samp, script, search, section, select, slot, small, source, span, strike (Deprecated), strong, style, sub, summary, sup, table, tbody, td, template, textarea, tfoot, th, thead, time, title, tr, track, tt (Deprecated), u, ul, var, video, wbr, xmp
 * 
 * - a
 * - abbr
 * - acronym (Deprecated)
 * - address
 * - area
 * - article
 * - aside
 * - audio
 * - b
 * - base
 * - bdi
 * - bdo
 * - big (Deprecated)
 * - blockquote
 * - body
 * - br
 * - button
 * - canvas
 * - caption
 * - center (Deprecated)
 * - cite
 * - code
 * - col
 * - colgroup
 * - data
 * - datalist
 * - dd
 * - del
 * - details
 * - dfn
 * - dialog
 * - dir (Deprecated)
 * - div
 * - dl
 * - dt
 * - em
 * - embed
 * - fencedframe (Experimental)
 * - fieldset
 * - figcaption
 * - figure
 * - font (Deprecated)
 * - footer
 * - form
 * - frame (Deprecated)
 * - frameset (Deprecated)
 * - h1
 * - head
 * - header
 * - hgroup
 * - hr
 * - html
 * - i
 * - iframe
 * - img
 * - input
 * - ins
 * - kbd
 * - label
 * - legend
 * - li
 * - link
 * - main
 * - map
 * - mark
 * - marquee (Deprecated)
 * - menu
 * - meta
 * - meter
 * - nav
 * - nobr (Deprecated)
 * - noembed (Deprecated)
 * - noframes (Deprecated)
 * - noscript
 * - object
 * - ol
 * - optgroup
 * - option
 * - output
 * - p
 * - param (Deprecated)
 * - picture
 * - plaintext (Deprecated)
 * - portal (Experimental)
 * - pre
 * - progress
 * - q
 * - rb (Deprecated)
 * - rp
 * - rt
 * - rtc (Deprecated)
 * - ruby
 * - s
 * - samp
 * - script
 * - search
 * - section
 * - select
 * - slot
 * - small
 * - source
 * - span
 * - strike (Deprecated)
 * - strong
 * - style
 * - sub
 * - summary
 * - sup
 * - table
 * - tbody
 * - td
 * - template
 * - textarea
 * - tfoot
 * - th
 * - thead
 * - time
 * - title
 * - tr
 * - track
 * - tt (Deprecated)
 * - u
 * - ul
 * - var
 * - video
 * - wbr
 * - xmp
 */

  const sqlDomQuery = `SELECT * FROM Dom WHERE
    Id LIKE 'btn'
    AND Id NOT LIKE 'btn-confirm' OR Id = 'a-confirm'
    AND Id <> 'modal-delete-user'
    AND Class = 'search-icon'
    AND Class LIKE '-primary'
    AND Class CONTAINS 'btn-primary' OR Class NOT CONTAINS 'btn-small'
    AND Attribute('data-color') = 'red'
  `;

  const lexerTokens = lexer(sqlDomQuery);  
  console.log(lexerTokens);

  const querySelector = parser(lexerTokens);
  console.log(querySelector);