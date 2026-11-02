-- Seeds all 20 currently in-stock static catalog products.
-- New variants start at 10 units; existing rows are left unchanged on re-run.
with product_colors (product_slug, color, sizes) as (
  values
    ('taitu-double-breasted-suit', 'Chocolate', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('menen-single-breasted-suit', 'Ivory', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('zewditu-oversized-suit', 'Black', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('selam-cropped-suit', 'Camel', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('almaz-pinstripe-suit', 'Chocolate Pinstripe', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('aster-belted-wrap-suit', 'Olive', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('makeda-tuxedo-suit', 'Black', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('genet-linen-suit', 'Sand', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('birtukan-velvet-collar-suit', 'Burgundy', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('senait-wide-leg-suit', 'Soft Gold', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('bete-seamless-crew', 'Ivory', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('bete-seamless-crew', 'Black', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('bete-seamless-crew', 'Dusty Rose', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('meri-ribbed-square-neck', 'Black', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('meri-ribbed-square-neck', 'Crimson', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('meri-ribbed-square-neck', 'Ivory', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('saba-one-shoulder-top', 'Ivory', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('saba-one-shoulder-top', 'Black', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('saba-one-shoulder-top', 'Burgundy', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('addis-cowl-knit', 'Chocolate', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('addis-cowl-knit', 'Sand', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('addis-cowl-knit', 'Black', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('entoto-corset-top', 'Soft Gold', array['XS', 'S', 'M', 'L']::text[]),
    ('entoto-corset-top', 'Ivory', array['XS', 'S', 'M', 'L']::text[]),
    ('entoto-corset-top', 'Burgundy', array['XS', 'S', 'M', 'L']::text[]),
    ('hana-cutout-top', 'Crimson', array['XS', 'S', 'M', 'L']::text[]),
    ('hana-cutout-top', 'Black', array['XS', 'S', 'M', 'L']::text[]),
    ('hana-cutout-top', 'Ivory', array['XS', 'S', 'M', 'L']::text[]),
    ('selam-mock-neck', 'Sand', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('selam-mock-neck', 'Chocolate', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('selam-mock-neck', 'Black', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('tsion-halter-top', 'Olive', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('tsion-halter-top', 'Ivory', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('tsion-halter-top', 'Black', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('meron-off-shoulder-top', 'Dusty Rose', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('meron-off-shoulder-top', 'Black', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('meron-off-shoulder-top', 'Ivory', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('abyssinia-wrap-top', 'Burgundy', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('abyssinia-wrap-top', 'Chocolate', array['XS', 'S', 'M', 'L', 'XL']::text[]),
    ('abyssinia-wrap-top', 'Black', array['XS', 'S', 'M', 'L', 'XL']::text[])
)
insert into public.product_variant_inventory (product_slug, color, size, quantity)
select product_slug, color, size, 10
from product_colors
cross join lateral unnest(product_colors.sizes) as sizes(size)
on conflict (product_slug, color, size) do nothing;
