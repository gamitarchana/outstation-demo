from django import template

register = template.Library()

@register.filter()
def parseInt(value):
    return int(value)

@register.filter(name="item")
def item(l, i):
    i = int('0' + i)
    try:
        return l[i]
    except:
        return None

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

@register.filter
def mod(number, modBy):
    return number % modBy

@register.filter
def formattime(duration):
    seconds = duration.seconds
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60

    formatedDuration =''
    if minutes == 0:
        formatedDuration = str(hours) + " hr"
    else:
        formatedDuration = str(hours) + " hr " + str(minutes) + " minutes"

    return formatedDuration

"""
@register.filter
def rendition(image, fill):
    rendered_image = image.get_rendition(fill)
    return rendered_image """
